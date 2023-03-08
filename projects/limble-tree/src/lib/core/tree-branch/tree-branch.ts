import { assert } from "../../../shared/assert";
import type { Observable } from "rxjs";
import type {
   ComponentRef,
   Type,
   ViewContainerRef,
   ViewRef
} from "@angular/core";
import { BranchComponent } from "../../components/branch/branch.component";
import type { NodeComponent } from "../../components/node-component.interface";
import { TreeNodeBase } from "../tree-node-base";
import { TreeError } from "../../errors";
import type {
   BranchOptions,
   FullBranchOptions
} from "../branch-options.interface";
import { dropzoneRenderer } from "../../extras/drag-and-drop/dropzone-renderer";
import { config } from "../configuration/configuration";
import { TreeRoot } from "..";
import { treeCollapser } from "../../extras/collapse/collapse";
import { DestructionEvent, GraftEvent, PruneEvent } from "../../events";
import type {
   TreeNode,
   TreePlot,
   TreeEvent,
   TreeBranchNode
} from "../../structure";
import { BranchController } from "./branch-controller";

/** Represents a standard node in a tree. Renders a BranchComponent, which does
 * the following:
 * 1. Renders a component provided by the user
 * 2. Provides a container in which child branches may be rendered
 * 3. Contains two Dropzones: one for dropping branches below this branch (as a
 * sibling), and one for dropping branches as a first child of this branch
 *
 * Provides all the same methods as a TreeRoot, as well as some additional methods.
 */
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
         parent.branchOptions.defaultCollapsed === true
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

   /** Returns all child branches as an array of TreeBranch instances */
   public branches(): Array<TreeBranch<UserlandComponent>> {
      return this.treeNodeBase.branches();
   }

   /**
    * Recursively destroys all descendant branches, as well as itself. This
    * releases all resources held or consumed by this branch and its descendants.
    *
    * It is important to call this method when a branch is discarded, otherwise
    * the branch will remain in memory and continue to consume resources.
    */
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

   /** Run Angular change detection on this branch */
   public detectChanges(): void {
      this.branchController.detectChanges();
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
      this._parent?.dispatch(event);
   }

   /**
    * Returns an observable that emits TreeEvents whenever an event is dispatched
    * in this branch or any of its descendant branches.
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
            "Cannot get branches container from a destroyed tree branch"
         );
      }
      return this.branchController.getBranchesContainer();
   }

   /**
    * Retrieves the instance of RootComponent that is rendered by this class.
    * The RootComponent holds the BranchesContainer, as well as a single Dropzone
    * for drag-and-drop operations.
    */
   public getComponentInstance(): BranchComponent<UserlandComponent> {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get component instance from a destroyed tree branch"
         );
      }
      return this.branchController.getComponentInstance();
   }

   /** Retrieves the Host View in which the RootComponent is rendered */
   public getHostView(): ViewRef {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get component host view from a destroyed tree branch"
         );
      }
      return this.branchController.getHostView();
   }

   /** Retrieves the RootComponent as a native HTML Element */
   public getNativeElement(): HTMLElement {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get native element from a destroyed tree branch"
         );
      }
      return this.branchController.getNativeElement();
   }

   /**
    * Retrieves a ComponentRef containing the instance of the user-provided
    * component which is rendered by this branch.
    */
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

   /**
    * If not already pruned, this method prunes (removes) this branch from its
    * current position in the tree; then grafts (reattaches) it as a child of the
    * specified parent branch at the specified index. If no index is specified,
    * the branch is appended as the last child of the parent. This causes this
    * branch's associated BranchComponent to be re-rendered in the DOM at the
    * new location.
    */
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

   /**
    * Appends a new child branch to this branch. The child branch will render
    * the specified component according to the (optional) configuration parameter.
    */
   public grow(
      component: Type<UserlandComponent>,
      options?: BranchOptions<UserlandComponent>
   ): TreeBranch<UserlandComponent> {
      if (this.isDestroyed()) {
         throw new TreeError("Cannot grow a branch on a destroyed tree branch");
      }
      return new TreeBranch(this, { component, ...options });
   }

   /**
    * Returns this branch's index in relation to its sibling branches. For example,
    * if it is the first child of its parent, this method will return 0. If it is
    * the second child of its parent, this method will return 1.
    *
    * If this branch has no parent, (eg, if this branch has been pruned) this
    * method will return undefined.
    */
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

   /** Returns true if the tree is destroyed, false otherwise */
   public isDestroyed(): boolean {
      return this.treeNodeBase.isDestroyed();
   }

   /**
    * Returns the data that was passing into the `branchOptions`' `meta` property
    * at construction.
    */
   public meta(): Record<string, any> {
      return this.branchOptions.meta ?? {};
   }

   /**
    * Returns this branch's parent node (which may be a TreeBranch or TreeRoot).
    * If this branch has no parent, (eg, if this branch has been pruned) this
    * method will return undefined.
    */
   public parent():
      | TreeNode<TreeBranch<UserlandComponent>, NodeComponent>
      | undefined {
      return this._parent;
   }

   /**
    * Returns a multi-dimensional Map which describes the shape of this branch's
    * descendants.
    *
    * For example, a branch with no children will return an empty Map. A branch with
    * a single child will return a Map with a single entry, where the key is the index
    * of the branch (zero) and the value is an empty Map. A Tree like this:
    *
    * ```
    *         ---Branch-------Branch
    *        /
    * Branch-------Branch
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

   /**
    * Returns an array of numbers which describe the branch's position in
    * the tree relative to the Root.
    *
    * For example, if this branch is the first child of the Root, this method
    * will return [0]. If this branch is the second child of the first child
    * of the Root, this method will return [0, 1].
    *
    * If the branch is not related to a TreeRoot, (such as when it has been
    * pruned,) this method will throw an error.
    */
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

   /**
    * Removes this branch from its parent and detaches its associated
    * BranchComponent from the DOM. This puts the branch in a "pruned" state,
    * which may affect the behavior of other methods. A pruned branch
    * can be reattached to any other node (TreeBranch or TreeRoot) using the
    * `graftTo` method.
    */
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

   /**
    * Returns the TreeRoot of the tree this branch is in. If this branch is
    * does not have a root (such as when it has been pruned) this method will
    * return undefined.
    */
   public root(): TreeRoot<UserlandComponent> | undefined {
      const parent = this.parent();
      if (parent instanceof TreeBranch) {
         return parent.root();
      }
      assert(parent instanceof TreeRoot || parent === undefined);
      return parent;
   }

   /**
    * Traverses this branch's descendants in depth-first pre-order, executing
    * the provided callback function on each node. Traversal includes this branch.
    */
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
