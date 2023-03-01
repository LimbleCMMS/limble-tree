import { assert } from "../../../shared/assert";
import { TreePlot } from "../../structure/tree-plot";
import { Observable } from "rxjs";
import { GraftEvent } from "../../events/relational/graft-event";
import { PruneEvent } from "../../events/relational/prune-event";
import { TreeEvent } from "../../structure/tree-event.interface";
import { TreeBranchNode } from "../../structure/tree-branch-node.interface";
import { ComponentRef, Type, ViewContainerRef, ViewRef } from "@angular/core";
import { BranchComponent } from "../../components/branch/branch.component";
import { NodeComponent } from "../../components/node-component.interface";
import { TreeNodeBase } from "../tree-node-base";
import { TreeError } from "../../errors/tree-error";
import { BranchOptions, FullBranchOptions } from "../branch-options.interface";
import { dropzoneRenderer } from "../../extras/drag-and-drop/dropzone-renderer";
import { config } from "../configuration/configuration";
import { TreeRoot } from "..";
import { treeCollapser } from "../../extras/collapse/collapse";
import { DestructionEvent } from "../../events/general";
import { TreeNode } from "../../structure";
import { BranchController } from "./branch-controller";

export class TreeBranch<UserlandComponent>
   implements
      TreeBranchNode<
         BranchComponent<UserlandComponent>,
         TreeBranch<UserlandComponent>,
         NodeComponent
      >
{
   private readonly branchController: BranchController<UserlandComponent>;
   private detachedView: ViewRef | null = null;
   private _parent:
      | TreeNode<TreeBranch<UserlandComponent>, NodeComponent>
      | undefined;
   private readonly treeNodeBase: TreeNodeBase<UserlandComponent>;

   public constructor(
      parent: TreeNode<TreeBranch<UserlandComponent>, NodeComponent>,
      public readonly branchOptions: FullBranchOptions<UserlandComponent>
   ) {
      this.treeNodeBase = new TreeNodeBase();
      const parentBranchesContainer = parent.getBranchesContainer();
      assert(parentBranchesContainer !== undefined);
      this.branchController = new BranchController(
         this,
         parentBranchesContainer
      );
      this.setIndentation(parent);
      if (
         parent instanceof TreeBranch &&
         parent.branchOptions.startCollapsed === true
      ) {
         treeCollapser.storePrecollapsedNode(parent, this);
         this.detachedView = this.branchController.getHostView();
      } else {
         parentBranchesContainer.insert(this.branchController.getHostView());
         this.detectChanges();
         this._parent = parent;
         this.dispatch(
            new GraftEvent(this, {
               parent: this._parent,
               child: this,
               index: this._parent.branches().length
            })
         );
      }
   }

   public branches(): Array<TreeBranch<UserlandComponent>> {
      return this.treeNodeBase.branches();
   }

   public destroy(): void {
      if (this.isDestroyed()) {
         throw new TreeError("Cannot destroy a destroyed tree branch");
      }
      this.prune();
      treeCollapser.expand(this);
      dropzoneRenderer.clearTreeFromRegistry(this);
      this.branchController.getHostView().destroy();
      this.treeNodeBase.destroy();
      this.branchController.destroy();
      this.dispatch(new DestructionEvent(this));
   }

   public detectChanges(): void {
      this.branchController.detectChanges();
   }

   public dispatch(event: TreeEvent): void {
      this.treeNodeBase.dispatch(event);
      this._parent?.dispatch(event);
   }

   public events(): Observable<TreeEvent> {
      return this.treeNodeBase.events();
   }

   public getBranch(index: number): TreeBranch<UserlandComponent> | undefined {
      return this.treeNodeBase.getBranch(index);
   }

   public getBranchesContainer(): ViewContainerRef | undefined {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get branches container from a destroyed tree branch"
         );
      }
      return this.branchController.getBranchesContainer();
   }

   public getComponentInstance(): BranchComponent<UserlandComponent> {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get component instance from a destroyed tree branch"
         );
      }
      return this.branchController.getComponentInstance();
   }

   public getHostView(): ViewRef {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get component host view from a destroyed tree branch"
         );
      }
      return this.branchController.getHostView();
   }

   public getNativeElement(): HTMLElement {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get native element from a destroyed tree branch"
         );
      }
      return this.branchController.getNativeElement();
   }

   public getUserlandComponentRef():
      | ComponentRef<UserlandComponent>
      | undefined {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get userland component from a destroyed tree branch"
         );
      }
      return this.branchController.getUserlandComponentRef();
   }

   public graftTo(
      newParent: TreeNode<TreeBranch<UserlandComponent>, NodeComponent>,
      index?: number
   ): number {
      this.checkGraftLocationValidity(newParent, index);
      const ownIndex = this.index();
      if (ownIndex !== undefined) {
         this.prune();
      }
      this._parent = newParent;
      const newIndex = index ?? newParent.branches().length;
      this.reattachView(newIndex);
      this.dispatch(
         new GraftEvent(this, {
            parent: newParent,
            child: this,
            index: newIndex
         })
      );
      return newIndex;
   }

   public grow(
      component: Type<UserlandComponent>,
      options?: BranchOptions<UserlandComponent>
   ): TreeBranch<UserlandComponent> {
      if (this.isDestroyed()) {
         throw new TreeError("Cannot grow a branch on a destroyed tree branch");
      }
      return new TreeBranch(this, { component, ...options });
   }

   public index(): number | undefined {
      if (!this._parent) {
         return undefined;
      }
      const index = this._parent
         .branches()
         .findIndex((branch) => branch === this);
      assert(index >= 0);
      return index;
   }

   public isDestroyed(): boolean {
      return this.treeNodeBase.isDestroyed();
   }

   public meta(): Record<string, any> {
      return this.branchOptions.meta ?? {};
   }

   public parent():
      | TreeNode<TreeBranch<UserlandComponent>, NodeComponent>
      | undefined {
      return this._parent;
   }

   public plot(): TreePlot {
      return this.treeNodeBase.plot();
   }

   public position(): Array<number> {
      const index = this.index();
      if (index === undefined) {
         throw new TreeError(
            "branch has no parent. Position cannot be determined."
         );
      }
      if (this._parent instanceof TreeBranch) {
         const parentPosition = this._parent.position();
         return [...parentPosition, index];
      }
      return [index];
   }

   public prune(): this | undefined {
      if (this.isDestroyed()) {
         throw new TreeError("Cannot prune a destroyed tree branch");
      }
      const parent = this._parent;
      const index = this.index();
      if (index === undefined || parent === undefined) return;
      const container = parent.getBranchesContainer();
      assert(container !== undefined);
      this.detachedView = container.detach(index);
      assert(this.detachedView !== null);
      this.detachedView.detach();
      this.dispatch(
         new PruneEvent(this, {
            parent: parent,
            child: this,
            index: index
         })
      );
      this._parent = undefined;
      return this;
   }

   public root(): TreeRoot<UserlandComponent> | undefined {
      const parent = this.parent();
      if (parent instanceof TreeBranch) {
         return parent.root();
      }
      assert(parent instanceof TreeRoot || parent === undefined);
      return parent;
   }

   public traverse(
      callback: (
         node: TreeNode<TreeBranch<UserlandComponent>, NodeComponent>
      ) => void
   ): void {
      callback(this);
      this.treeNodeBase.traverse(callback);
   }

   private checkGraftLocationValidity(
      newParent: TreeNode<TreeBranch<UserlandComponent>, NodeComponent>,
      index?: number
   ): void {
      if (this.isDestroyed()) {
         throw new TreeError("Cannot graft a destroyed tree branch");
      }
      if (newParent.isDestroyed()) {
         throw new TreeError("Cannot graft to a destroyed tree branch");
      }
      if (
         typeof index === "number" &&
         this.indexIsOutOfRange(newParent, index)
      ) {
         throw new TreeError(
            `Cannot graft branch at index ${index} of the parent. Out of range.`
         );
      }
      this.traverse((node) => {
         if (node === newParent) {
            throw new TreeError(
               "Cannot graft a branch to itself or any of its own descendants"
            );
         }
      });
   }

   private indexIsOutOfRange(
      parent: TreeNode<TreeBranch<UserlandComponent>, NodeComponent>,
      index: number
   ): boolean {
      return index < 0 || index > parent.branches().length;
   }

   private reattachView(index?: number): void {
      assert(this._parent !== undefined);
      assert(this.detachedView !== null);
      const container = this._parent.getBranchesContainer();
      assert(container !== undefined);
      this.detachedView.reattach();
      container.insert(this.detachedView, index);
      this.detachedView = null;
   }

   private setIndentation(
      parent: TreeNode<TreeBranch<UserlandComponent>, NodeComponent>
   ): void {
      const root = parent.root();
      assert(root !== undefined);
      const options = config.getConfig(root);
      const branchesContainerEl = this.branchController
         .getNativeElement()
         .getElementsByClassName("branches-container")
         .item(0);
      assert(branchesContainerEl instanceof HTMLElement);
      branchesContainerEl.style.marginLeft = `${options?.indentation ?? 16}px`;
   }
}
