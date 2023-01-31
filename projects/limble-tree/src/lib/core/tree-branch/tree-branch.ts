import { assert } from "../../../shared/assert";
import { TreePlot } from "../../structure/tree-plot";
import { Observable } from "rxjs";
import { GraftEvent } from "../../events/graft-event";
import { PruneEvent } from "../../events/prune-event";
import { TreeEvent } from "../../events/tree-event.interface";
import { TreeBranchNode } from "../../structure/nodes/tree-branch-node.interface";
import { ComponentRef, Type, ViewRef } from "@angular/core";
import { BranchComponent } from "../../components/branch/branch.component";
import { ContainerTreeNode } from "../../structure/nodes/container-tree-node.interface";
import { NodeComponent } from "../../components/node-component.interface";
import { TreeNodeBase } from "../tree-node-base";
import { TreeError } from "../../errors/tree-error";
import { BranchOptions, FullBranchOptions } from "../branch-options.interface";

export class TreeBranch<UserlandComponent>
   implements
      TreeBranchNode<
         ComponentRef<BranchComponent<UserlandComponent>>,
         TreeBranch<UserlandComponent>,
         ComponentRef<NodeComponent>
      >
{
   private readonly contents: ComponentRef<BranchComponent<UserlandComponent>>;
   private _parent:
      | ContainerTreeNode<
           ComponentRef<NodeComponent>,
           TreeBranch<UserlandComponent>
        >
      | undefined;
   private readonly treeNodeBase: TreeNodeBase<UserlandComponent>;
   private readonly userlandComponent: Type<UserlandComponent>;
   private detachedView: ViewRef | null = null;

   public constructor(
      parent: ContainerTreeNode<
         ComponentRef<NodeComponent>,
         TreeBranch<UserlandComponent>
      >,
      branchOptions: FullBranchOptions<UserlandComponent>
   ) {
      this.treeNodeBase = new TreeNodeBase();
      this.userlandComponent = branchOptions.component;
      this._parent = parent;
      const parentBranchesContainer =
         this._parent.getContents().instance.branchesContainer;
      assert(parentBranchesContainer !== undefined);
      this.contents =
         parentBranchesContainer.createComponent<
            BranchComponent<UserlandComponent>
         >(BranchComponent);
      this.contents.instance.contentToHost = this.userlandComponent;
      this.contents.instance.contentCreated.subscribe(
         (userlandComponentInstance) => {
            for (const [key, value] of Object.entries(
               branchOptions.inputBindings ?? {}
            )) {
               (userlandComponentInstance as any)[key] = value;
            }
            for (const [key, value] of Object.entries(
               branchOptions.outputBindings ?? {}
            )) {
               (userlandComponentInstance as any)[key].subscribe(value);
            }
            (userlandComponentInstance as any).treeBranch = this;
         }
      );
      this.contents.changeDetectorRef.detectChanges();
      this.dispatch(
         new GraftEvent(this, {
            parent: this._parent,
            child: this,
            index: this._parent.branches().length
         })
      );
   }

   public branches(): Array<TreeBranch<UserlandComponent>> {
      return this.treeNodeBase.branches();
   }

   public deleteBranch(index?: number): void {
      this.treeNodeBase.deleteBranch(index);
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

   public getContents(): ComponentRef<BranchComponent<UserlandComponent>> {
      return this.contents;
   }

   public graftTo(
      newParent: ContainerTreeNode<
         ComponentRef<NodeComponent>,
         TreeBranch<UserlandComponent>
      >,
      index?: number
   ): number {
      const ownIndex = this.index();
      if (ownIndex !== undefined) {
         this.prune();
      }
      this._parent = newParent;
      const newIndex = index ?? newParent.branches().length;
      this.reattachView();
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

   public parent():
      | ContainerTreeNode<
           ComponentRef<NodeComponent>,
           TreeBranch<UserlandComponent>
        >
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
      const parent = this._parent;
      const index = this.index();
      if (index === undefined || parent === undefined) return;
      const container = parent.getContents().instance.branchesContainer;
      assert(container !== undefined);
      this.detachedView = container.detach(index);
      assert(this.detachedView !== null);
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

   public traverse(
      callback: (
         node: ContainerTreeNode<
            ComponentRef<NodeComponent>,
            TreeBranch<UserlandComponent>
         >
      ) => void
   ): void {
      callback(this);
      this.treeNodeBase.traverse(callback);
   }

   private reattachView(index?: number): void {
      assert(this._parent !== undefined);
      assert(this.detachedView !== null);
      const container = this._parent.getContents().instance.branchesContainer;
      assert(container !== undefined);
      container.insert(this.detachedView, index);
      this.detachedView = null;
   }
}
