import type { Observable } from "rxjs";
import { TreeBranch } from "../tree-branch/tree-branch";
import type { Type, ViewContainerRef, ViewRef } from "@angular/core";
import { RootComponent } from "../../components/root/root.component";
import { TreeNodeBase } from "../tree-node-base";
import type { NodeComponent } from "../../components/node-component.interface";
import type { BranchOptions } from "../branch-options.interface";
import { dropzoneRenderer } from "../../extras/drag-and-drop/dropzone-renderer";
import { config } from "../configuration/configuration";
import { TreeError } from "../../errors";
import { DestructionEvent } from "../../events";
import type { TreeNode, TreePlot, TreeEvent } from "../../structure";
import { RootController } from "./root-controller";

/**
 * Represents the base of the tree. It renders a very simple container for child
 * branches. It has methods for creating and accessing those branches. It emits
 * events when things happen in the tree.
 */
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

   /** Returns all child branches as an array of TreeBranch instances */
   public branches(): Array<TreeBranch<UserlandComponent>> {
      return this.treeNodeBase.branches();
   }

   /**
    * Recursively destroys all branches of the tree, as well as itself. This
    * releases all resources held or consumed by the tree.
    *
    * It is important to call this method when a tree is discarded, otherwise
    * the tree will remain in memory and continue to consume resources.
    */
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

   /** Run Angular change detection on the root of the tree */
   public detectChanges(): void {
      this.rootController.detectChanges();
   }

   /**
    * Emits the specified TreeEvent.
    *
    * Caution: It is not recommended to manually emit TreeEvents that are already
    * provided by the library. For example, it is not recommended to emit a
    * `GraftEvent`, `DestructionEvent`, etc. These events may be used by the tree,
    * and emitting them manually may cause unexpected behavior. Instead, we
    * recommend implementing the TreeEvent interface with your own custom events
    * and dispatching those.
    */
   public dispatch(event: TreeEvent): void {
      this.treeNodeBase.dispatch(event);
   }

   /**
    * Returns an observable that emits TreeEvents whenever an event is dispatched
    * in the root or any of its descendant branches.
    */
   public events(): Observable<TreeEvent> {
      return this.treeNodeBase.events();
   }

   /**
    * Get the child branch at the specified index. Returns undefined if there is
    * no child branch at the specified index.
    */
   public getBranch(index: number): TreeBranch<UserlandComponent> | undefined {
      return this.treeNodeBase.getBranch(index);
   }

   /** Retrieves the ViewContainerRef in which child branches are rendered */
   public getBranchesContainer(): ViewContainerRef | undefined {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get branches container from a destroyed tree root"
         );
      }
      return this.rootController.getBranchesContainer();
   }

   /**
    * Retrieves the instance of RootComponent that is rendered by this class.
    * The RootComponent holds the BranchesContainer, as well as a single Dropzone
    * for drag-and-drop operations.
    */
   public getComponentInstance(): RootComponent {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get component instance from a destroyed tree root"
         );
      }
      return this.rootController.getComponentInstance();
   }

   /** Retrieves the Host View in which the RootComponent is rendered */
   public getHostView(): ViewRef {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get component host view from a destroyed tree root"
         );
      }
      return this.rootController.getHostView();
   }

   /** Retrieves the RootComponent as a native HTML Element */
   public getNativeElement(): HTMLElement {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get native element from a destroyed tree root"
         );
      }
      return this.rootController.getNativeElement();
   }

   /**
    * Appends a new child branch to the root. The child branch will render
    * the specified component according to the (optional) configuration parameter.
    */
   public grow(
      component: Type<UserlandComponent>,
      options?: BranchOptions<UserlandComponent>
   ): TreeBranch<UserlandComponent> {
      if (this.isDestroyed()) {
         throw new TreeError("Cannot grow a branch on a destroyed tree root");
      }
      return new TreeBranch(this, { component, ...options });
   }

   /** Returns true if the tree is destroyed, false otherwise */
   public isDestroyed(): boolean {
      return this.treeNodeBase.isDestroyed();
   }

   /**
    * Returns a multi-dimensional Map which describes the shape of the tree.
    *
    * For example, an empty tree will return an empty Map. A tree with a single
    * branch will return a Map with a single entry, where the key is the index
    * of the branch (zero) and the value is an empty Map. A Tree like this:
    *
    * ```
    *         ---Branch-------Branch
    *        /
    * Root-------Branch
    *        \
    *         ---Branch
    * ```
    * Will return a Map of matching shape:
    * ```
    * Map {
    *    0: Map { 0: Map {}},
    *    1: Map {},
    *    2: Map {}
    * }
    * ```
    */
   public plot(): TreePlot {
      return this.treeNodeBase.plot();
   }

   /** Returns itself */
   public root(): this {
      return this;
   }

   /**
    * Traverses the tree in depth-first pre-order, executing the provided
    * callback function on each node. Traversal includes the Root.
    */
   public traverse(
      callback: (
         node: TreeNode<TreeBranch<UserlandComponent>, NodeComponent>
      ) => void
   ): void {
      callback(this);
      this.treeNodeBase.traverse(callback);
   }
}
