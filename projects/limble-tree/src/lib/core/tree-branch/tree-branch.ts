import { assert } from "../../../shared/assert";
import { TreePlot } from "../../structure/tree-plot";
import { Observable } from "rxjs";
import { GraftEvent } from "../../events/graft-event";
import { PruneEvent } from "../../events/prune-event";
import { TreeEvent } from "../../events/tree-event.interface";
import { TreeBranchNode } from "../../structure/nodes/tree-branch-node.interface";
import { ComponentRef, Type } from "@angular/core";
import { BranchComponent } from "../../components/branch/branch.component";
import { VirtualTreeRoot } from "../virtual-tree-root/virtual-tree-root";
import { ContainerTreeNode } from "../../structure/nodes/container-tree-node.interface";
import { NodeComponent } from "../../components/node-component.interface";
import { VirtualComponent } from "../../components/virtual-component/virtual.component";
import { TreeNodeBase } from "../tree-node-base/tree-node-base";

export class TreeBranch<UserlandComponent>
   implements
      TreeBranchNode<
         ComponentRef<BranchComponent<UserlandComponent>>,
         TreeBranch<unknown>,
         ComponentRef<NodeComponent>
      >
{
   private readonly contents: ComponentRef<BranchComponent<UserlandComponent>>;
   private _parent: ContainerTreeNode<
      ComponentRef<NodeComponent>,
      TreeBranch<unknown>
   >;
   private readonly treeNodeBase: TreeNodeBase;
   private readonly userlandComponent: Type<UserlandComponent>;
   private readonly virtualComponent: ComponentRef<VirtualComponent>;

   public constructor(
      userlandComponent: Type<UserlandComponent>,
      virtualComponent: ComponentRef<VirtualComponent>
   ) {
      this.treeNodeBase = new TreeNodeBase();
      this.userlandComponent = userlandComponent;
      this.virtualComponent = virtualComponent;
      this._parent = new VirtualTreeRoot(this.virtualComponent);
      const parentBranchesContainer =
         this._parent.getContents().instance.branchesContainer;
      assert(parentBranchesContainer !== undefined);
      this.contents =
         parentBranchesContainer.createComponent<
            BranchComponent<UserlandComponent>
         >(BranchComponent);
      this.contents.instance.contentToHost = this.userlandComponent;
      this.contents.changeDetectorRef.detectChanges();
      this.dispatch(
         new GraftEvent(this, { parent: this._parent, child: this, index: 0 })
      );
   }

   public branches(): Array<TreeBranch<unknown>> {
      return this.treeNodeBase.branches();
   }

   public deleteBranch(index?: number): void {
      this.treeNodeBase.deleteBranch(index);
   }

   public dispatch(event: TreeEvent): void {
      this.treeNodeBase.dispatch(event);
      this._parent.dispatch(event);
   }

   public events(): Observable<TreeEvent> {
      return this.treeNodeBase.events();
   }

   public getBranch(index: number): TreeBranch<unknown> | undefined {
      return this.treeNodeBase.getBranch(index);
   }

   public getContents(): ComponentRef<BranchComponent<UserlandComponent>> {
      return this.contents;
   }

   public graftTo(
      newParent: ContainerTreeNode<
         ComponentRef<NodeComponent>,
         TreeBranch<unknown>
      >,
      index?: number
   ): number {
      this.dispatch(
         new PruneEvent(this, {
            parent: this._parent,
            child: this,
            index: this.index()
         })
      );
      this._parent = newParent;
      const newIndex = index ?? this.parent().branches().length;
      this.dispatch(
         new GraftEvent(this, {
            parent: this._parent,
            child: this,
            index: newIndex
         })
      );
      return newIndex;
   }

   public index(): number {
      const index = this._parent
         .branches()
         .findIndex((branch) => branch === this);
      assert(index >= 0);
      return index;
   }

   public parent(): ContainerTreeNode<
      ComponentRef<NodeComponent>,
      TreeBranch<unknown>
   > {
      return this._parent;
   }

   public plot(): TreePlot {
      return this.treeNodeBase.plot();
   }

   public position(): Array<number> {
      if (this._parent instanceof TreeBranch) {
         const parentPosition = this._parent.position();
         return [...parentPosition, this.index()];
      }
      return [this.index()];
   }

   public prune(): void {
      this.dispatch(
         new PruneEvent(this, {
            parent: this._parent,
            child: this,
            index: this.index()
         })
      );
      this._parent = new VirtualTreeRoot(this.virtualComponent);
      this.dispatch(
         new GraftEvent(this, { parent: this._parent, child: this, index: 0 })
      );
   }

   public traverse(
      callback: (
         node: ContainerTreeNode<
            ComponentRef<NodeComponent>,
            TreeBranch<unknown>
         >
      ) => void
   ): void {
      callback(this);
      this.treeNodeBase.traverse(callback);
   }
}
