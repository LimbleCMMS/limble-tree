import { TreePlot } from "../../structure/tree-plot";
import { Observable } from "rxjs";
import { TreeEvent } from "../../events/tree-event.interface";
import { TreeBranch } from "../tree-branch/tree-branch";
import { ComponentRef, ViewContainerRef } from "@angular/core";
import { RootComponent } from "../../components/root/root.component";
import { TreeNodeBase } from "../tree-node-base/tree-node-base";
import { TreeRootNode } from "../../structure/nodes/tree-root.node.interface";
import { ContainerTreeNode } from "../../structure/nodes/container-tree-node.interface";
import { NodeComponent } from "../../components/node-component.interface";

export class TreeRoot
   implements TreeRootNode<ComponentRef<RootComponent>, TreeBranch<unknown>>
{
   private readonly rootComponentRef: ComponentRef<RootComponent>;
   private readonly treeNodeBase: TreeNodeBase;

   public constructor(viewContainerRef: ViewContainerRef) {
      this.treeNodeBase = new TreeNodeBase();
      this.rootComponentRef = viewContainerRef.createComponent(RootComponent);
      this.rootComponentRef.changeDetectorRef.detectChanges();
   }

   public branches(): Array<TreeBranch<unknown>> {
      return this.treeNodeBase.branches();
   }

   public deleteBranch(index?: number): void {
      this.treeNodeBase.deleteBranch(index);
   }

   public dispatch(event: TreeEvent): void {
      this.treeNodeBase.dispatch(event);
   }

   public events(): Observable<TreeEvent> {
      return this.treeNodeBase.events();
   }

   public getBranch(index: number): TreeBranch<unknown> | undefined {
      return this.treeNodeBase.getBranch(index);
   }

   public getContents(): ComponentRef<RootComponent> {
      return this.rootComponentRef;
   }

   public plot(): TreePlot {
      return this.treeNodeBase.plot();
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
