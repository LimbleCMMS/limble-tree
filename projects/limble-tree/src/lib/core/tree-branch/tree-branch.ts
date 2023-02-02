import { assert } from "../../../shared/assert";
import { TreePlot } from "../../structure/tree-plot";
import { filter, Observable, Subscription } from "rxjs";
import { GraftEvent } from "../../events/relational/graft-event";
import { PruneEvent } from "../../events/relational/prune-event";
import { TreeEvent } from "../../structure/tree-event.interface";
import { TreeBranchNode } from "../../structure/tree-branch-node.interface";
import {
   ComponentRef,
   createComponent,
   EnvironmentInjector,
   Type,
   ViewRef
} from "@angular/core";
import { BranchComponent } from "../../components/branch/branch.component";
import { ContainerTreeNode } from "../../structure/container-tree-node.interface";
import { NodeComponent } from "../../components/node-component.interface";
import { TreeNodeBase } from "../tree-node-base";
import { TreeError } from "../../errors/tree-error";
import { BranchOptions, FullBranchOptions } from "../branch-options.interface";
import { dropzoneRenderer } from "../../extras/drag-and-drop/dropzone-renderer";
import { config } from "../configuration/configuration";
import { TreeRoot } from "..";
import { treeCollapser } from "../../extras/collapse/collapse";

export class TreeBranch<UserlandComponent>
   implements
      TreeBranchNode<
         ComponentRef<BranchComponent<UserlandComponent>>,
         TreeBranch<UserlandComponent>,
         ComponentRef<NodeComponent>
      >
{
   private readonly contents: ComponentRef<BranchComponent<UserlandComponent>>;
   private readonly instanceSubscriptions: Array<Subscription>;
   private readonly outputBindingSubscriptions: Array<Subscription>;
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
      public readonly branchOptions: FullBranchOptions<UserlandComponent>
   ) {
      this.treeNodeBase = new TreeNodeBase();
      this.userlandComponent = this.branchOptions.component;
      const parentBranchesContainer =
         parent.getContents().instance.branchesContainer;
      assert(parentBranchesContainer !== undefined);
      this.contents = createComponent<BranchComponent<UserlandComponent>>(
         BranchComponent,
         {
            environmentInjector:
               parentBranchesContainer.injector.get(EnvironmentInjector)
         }
      );
      this.contents.instance.contentToHost = this.userlandComponent;
      this.setIndentation(parent);
      this.outputBindingSubscriptions = [];
      const contentCreatedSub = this.contents.instance.contentCreated.subscribe(
         (userlandComponentInstance) => {
            for (const [key, value] of Object.entries(
               this.branchOptions.inputBindings ?? {}
            )) {
               (userlandComponentInstance as any)[key] = value;
            }
            for (const [key, value] of Object.entries(
               this.branchOptions.outputBindings ?? {}
            )) {
               this.outputBindingSubscriptions.push(
                  (userlandComponentInstance as any)[key].subscribe(value)
               );
            }
            (userlandComponentInstance as any).treeBranch = this;
            const dropzones = this.contents.instance.dropzones;
            if (!dropzones) {
               throw new Error("dropzones not defined");
            }
            dropzoneRenderer.registerDropzones(dropzones, this);
         }
      );
      const showLowerZonesSub = this.contents.instance.showDropzones
         .pipe(filter((direction) => direction === "lower"))
         .subscribe(() => {
            dropzoneRenderer.showLowerZones(this);
         });
      const showUpperZonesSub = this.contents.instance.showDropzones
         .pipe(filter((direction) => direction === "upper"))
         .subscribe(() => {
            dropzoneRenderer.showUpperZones(this);
         });
      const droppedSub = this.contents.instance.dropped.subscribe(
         (placement) => {
            dropzoneRenderer.handleDrop(this, placement);
         }
      );
      this.instanceSubscriptions = [
         contentCreatedSub,
         showLowerZonesSub,
         showUpperZonesSub,
         droppedSub
      ];
      if (
         parent instanceof TreeBranch &&
         parent.branchOptions.startCollapsed === true
      ) {
         treeCollapser.storePrecollapsedNode(parent, this);
         this.detachedView = this.contents.hostView;
      } else {
         parentBranchesContainer.insert(this.contents.hostView);
         this.contents.changeDetectorRef.detectChanges();
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

   public deleteBranch(index?: number): void {
      this.treeNodeBase.deleteBranch(index);
   }

   public destroy(): void {
      if (treeCollapser.isCollapsed(this)) {
         treeCollapser.expand(this);
         dropzoneRenderer.clearTreeFromRegistry(this);
      }
      this.branches().forEach((branch) => {
         branch.destroy();
      });
      this.treeNodeBase.destroy();
      this.instanceSubscriptions.forEach((sub) => {
         sub.unsubscribe();
      });
      this.outputBindingSubscriptions.forEach((sub) => {
         sub.unsubscribe();
      });
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

   public root(): TreeRoot<UserlandComponent> | undefined {
      const parent = this.parent();
      if (parent === undefined) {
         return undefined;
      }
      if (parent instanceof TreeBranch) {
         return parent.root();
      }
      if (parent instanceof TreeRoot) {
         return parent;
      }
      throw new Error("unexpected parent type");
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

   private setIndentation(
      parent: ContainerTreeNode<
         ComponentRef<NodeComponent>,
         TreeBranch<UserlandComponent>
      >
   ): void {
      const root = parent.root();
      assert(root !== undefined);
      const options = config.getConfig(root);
      const branchesContainerEl = this.contents.location.nativeElement
         .getElementsByClassName("branches-container")
         .item(0);
      assert(branchesContainerEl instanceof HTMLElement);
      branchesContainerEl.style.marginLeft = `${options?.indentation ?? 16}px`;
   }
}
