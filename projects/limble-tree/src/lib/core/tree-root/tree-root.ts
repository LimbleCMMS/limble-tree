import { TreePlot } from "../../structure/tree-plot";
import { Observable, Subscription } from "rxjs";
import { TreeEvent } from "../../structure/tree-event.interface";
import { TreeBranch } from "../tree-branch/tree-branch";
import { ComponentRef, Type, ViewContainerRef } from "@angular/core";
import { RootComponent } from "../../components/root/root.component";
import { TreeNodeBase } from "../tree-node-base";
import { TreeRootNode } from "../../structure/tree-root.node.interface";
import { ContainerTreeNode } from "../../structure/container-tree-node.interface";
import { NodeComponent } from "../../components/node-component.interface";
import { BranchOptions } from "../branch-options.interface";
import { dropzoneRenderer } from "../../extras/drag-and-drop/dropzone-renderer";
import { config } from "../configuration/configuration";

export class TreeRoot<UserlandComponent>
   implements
      TreeRootNode<ComponentRef<RootComponent>, TreeBranch<UserlandComponent>>
{
   private readonly instanceSubscriptions: Array<Subscription>;
   private readonly rootComponentRef: ComponentRef<RootComponent>;
   private readonly treeNodeBase: TreeNodeBase<UserlandComponent>;

   public constructor(private readonly viewContainerRef: ViewContainerRef) {
      this.treeNodeBase = new TreeNodeBase();
      this.rootComponentRef =
         this.viewContainerRef.createComponent(RootComponent);
      const viewInitSub =
         this.rootComponentRef.instance.afterViewInit.subscribe(() => {
            const dropzone = this.rootComponentRef.instance.dropzone;
            if (!dropzone) {
               throw new Error("dropzone not defined");
            }
            dropzoneRenderer.registerDropzone(dropzone, this);
         });
      const droppedSub = this.rootComponentRef.instance.dropped.subscribe(
         () => {
            dropzoneRenderer.handleDrop(this, "inner");
         }
      );
      this.instanceSubscriptions = [viewInitSub, droppedSub];
      this.rootComponentRef.changeDetectorRef.detectChanges();
   }

   public branches(): Array<TreeBranch<UserlandComponent>> {
      return this.treeNodeBase.branches();
   }

   public deleteBranch(index?: number): void {
      this.treeNodeBase.deleteBranch(index);
   }

   public destroy(): void {
      dropzoneRenderer.clearTreeFromRegistry(this);
      this.branches().forEach((branch) => {
         branch.destroy();
      });
      this.treeNodeBase.destroy();
      this.instanceSubscriptions.forEach((sub) => {
         sub.unsubscribe();
      });
      this.viewContainerRef.clear();
      config.delete(this);
   }

   public dispatch(event: TreeEvent): void {
      this.treeNodeBase.dispatch(event);
   }

   public events(): Observable<TreeEvent> {
      return this.treeNodeBase.events();
   }

   public getBranch(index: number): TreeBranch<UserlandComponent> | undefined {
      return this.treeNodeBase.getBranch(index);
   }

   public getContents(): ComponentRef<RootComponent> {
      return this.rootComponentRef;
   }

   public grow(
      component: Type<UserlandComponent>,
      options?: BranchOptions<UserlandComponent>
   ): TreeBranch<UserlandComponent> {
      return new TreeBranch(this, { component, ...options });
   }

   public plot(): TreePlot {
      return this.treeNodeBase.plot();
   }

   public root(): this {
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
}
