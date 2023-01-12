import { TreePlot } from "../../structure/tree-plot";
import { Observable } from "rxjs";
import { TreeEvent } from "../../events/tree-event.interface";
import { TreeNode } from "../../structure/tree-node.interface";
import { TreeBranch } from "../tree-branch/tree-branch";
import { assert } from "../../../shared/assert";
import { ComponentRef, Type, ViewContainerRef } from "@angular/core";
import { BranchComponent } from "../../components/branch/branch.component";
import { BranchOptions } from "../branch-options";
import { RootComponent } from "../../components/root/root.component";
import { getViewContainer } from "../../test-util/view-container";
import { TreeNodeBase } from "../tree-node-base/tree-node-base";

export class VirtualTreeRoot implements TreeNode<TreeBranch<unknown>> {
   private readonly rootComponentRef: ComponentRef<RootComponent>;
   private readonly treeNodeBase: TreeNodeBase;

   public constructor() {
      this.treeNodeBase = new TreeNodeBase();
      this.rootComponentRef = getViewContainer().createComponent(RootComponent);
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

   public growBranch<T>(options: BranchOptions<T>): TreeBranch<T> {
      const nodeRef = this.insertComponent(options.component);
      const branch = new TreeBranch<T>(nodeRef);
      this.treeNodeBase.growBranch(branch);
      return branch;
   }

   public plot(): TreePlot {
      return this.treeNodeBase.plot();
   }

   public traverse(
      callback: (node: TreeNode<TreeBranch<unknown>>) => void
   ): void {
      callback(this);
      this.treeNodeBase.traverse(callback);
   }

   private getBranchesContainer(): ViewContainerRef {
      const container = this.rootComponentRef.instance?.branchesContainer;
      assert(container !== undefined);
      return container;
   }

   private insertComponent<T>(
      component: Type<T>
   ): ComponentRef<BranchComponent<T>> {
      const container = this.getBranchesContainer();
      const componentRef =
         container.createComponent<BranchComponent<T>>(BranchComponent);
      componentRef.instance.content = component;
      componentRef.changeDetectorRef.detectChanges();
      return componentRef;
   }
}
