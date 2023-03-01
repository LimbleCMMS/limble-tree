import { TreePlot } from "../../structure/tree-plot";
import { Observable } from "rxjs";
import { TreeEvent } from "../../structure/tree-event.interface";
import { TreeBranch } from "../tree-branch/tree-branch";
import { Type, ViewContainerRef, ViewRef } from "@angular/core";
import { RootComponent } from "../../components/root/root.component";
import { TreeNodeBase } from "../tree-node-base";
import { NodeComponent } from "../../components/node-component.interface";
import { BranchOptions } from "../branch-options.interface";
import { dropzoneRenderer } from "../../extras/drag-and-drop/dropzone-renderer";
import { config } from "../configuration/configuration";
import { TreeError } from "../../errors";
import { DestructionEvent } from "../../events/general";
import { TreeNode } from "../../structure";
import { RootController } from "./root-controller";

export class TreeRoot<UserlandComponent>
   implements TreeNode<TreeBranch<UserlandComponent>, RootComponent>
{
   private readonly rootController: RootController<UserlandComponent>;
   private readonly treeNodeBase: TreeNodeBase<UserlandComponent>;

   public constructor(private readonly viewContainerRef: ViewContainerRef) {
      this.treeNodeBase = new TreeNodeBase();
      this.rootController = new RootController(this, viewContainerRef);
      this.detectChanges();
   }

   public branches(): Array<TreeBranch<UserlandComponent>> {
      return this.treeNodeBase.branches();
   }

   public destroy(): void {
      if (this.isDestroyed()) {
         throw new TreeError("Cannot destroy a destroyed tree root");
      }
      dropzoneRenderer.clearTreeFromRegistry(this);
      this.treeNodeBase.destroy();
      this.rootController.destroy();
      this.viewContainerRef.clear();
      config.delete(this);
      this.dispatch(new DestructionEvent(this));
   }

   public detectChanges(): void {
      this.rootController.detectChanges();
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

   public getBranchesContainer(): ViewContainerRef | undefined {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get branches container from a destroyed tree root"
         );
      }
      return this.rootController.getBranchesContainer();
   }

   public getComponentInstance(): RootComponent {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get component instance from a destroyed tree root"
         );
      }
      return this.rootController.getComponentInstance();
   }

   public getHostView(): ViewRef {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get component host view from a destroyed tree root"
         );
      }
      return this.rootController.getHostView();
   }

   public getNativeElement(): HTMLElement {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get native element from a destroyed tree root"
         );
      }
      return this.rootController.getNativeElement();
   }

   public grow(
      component: Type<UserlandComponent>,
      options?: BranchOptions<UserlandComponent>
   ): TreeBranch<UserlandComponent> {
      if (this.isDestroyed()) {
         throw new TreeError("Cannot grow a branch on a destroyed tree root");
      }
      return new TreeBranch(this, { component, ...options });
   }

   public isDestroyed(): boolean {
      return this.treeNodeBase.isDestroyed();
   }

   public plot(): TreePlot {
      return this.treeNodeBase.plot();
   }

   public root(): this {
      return this;
   }

   public traverse(
      callback: (
         node: TreeNode<TreeBranch<UserlandComponent>, NodeComponent>
      ) => void
   ): void {
      callback(this);
      this.treeNodeBase.traverse(callback);
   }
}
