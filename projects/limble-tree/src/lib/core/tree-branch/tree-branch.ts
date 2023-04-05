import { assert } from "../../../shared";
import type { Observable } from "rxjs";
import type {
   ComponentRef,
   Type,
   ViewContainerRef,
   ViewRef
} from "@angular/core";
import { BranchComponent } from "../../components";
import { TreeError } from "../../errors";
import { dropzoneRenderer } from "../../extras/drag-and-drop";
import { TreeRoot } from "../tree-root";
import type { TreeNode } from "../tree-node.interface";
import type { TreePlot } from "../tree-plot.interface";
import { TreeNodeBase } from "../tree-node-base";
import { config } from "../configuration";
import type {
   BranchOptions,
   FullBranchOptions
} from "../branch-options.interface";
import { BranchController } from "./branch-controller";
import type { Graftable } from "./graftable.interface";
import { treeCollapser } from "../../extras/collapse";
import {
   DestructionEvent,
   GraftEvent,
   PruneEvent,
   type TreeEvent
} from "../../events";

/** Represents a standard node in a tree. Renders a BranchComponent.
 *
 * @remarks
 * This class renders a branch component, which does the following:
 * 1. Renders a component provided by the user
 * 2. Provides a container in which child branches may be rendered
 * 3. Contains two Dropzones: one for dropping branches below this branch (as a
 * sibling), and one for dropping branches as a first child of this branch.
 */
export class TreeBranch<UserlandComponent>
   implements TreeNode<UserlandComponent>, Graftable<UserlandComponent>
{
   private readonly branchController: BranchController<UserlandComponent>;
   private detachedView: ViewRef | null = null;
   private _parent: TreeNode<UserlandComponent> | undefined;
   private readonly treeNodeBase: TreeNodeBase<UserlandComponent>;

   public constructor(
      parent: TreeNode<UserlandComponent>,
      public readonly branchOptions: FullBranchOptions<UserlandComponent>
   ) {
      this.treeNodeBase = new TreeNodeBase();
      const parentBranchesContainer = parent.getBranchesContainer();
      assert(parentBranchesContainer !== undefined);
      this.branchController = new BranchController(
         this,
         parentBranchesContainer
      );
      const hostView = this.branchController.getHostView();
      this.setIndentation(parent);
      if (
         parent instanceof TreeBranch &&
         parent.branchOptions.defaultCollapsed === true
      ) {
         treeCollapser.storePrecollapsedNode(parent, this);
         this.detachedView = hostView;
      } else {
         parentBranchesContainer.insert(hostView);
         this._parent = parent;
         this.dispatch(
            new GraftEvent(this, {
               parent: this._parent,
               child: this,
               index: this._parent.branches().length
            })
         );
         this.detectChanges();
      }
   }

   /** @returns All child branches as an array of TreeBranch instances, in order. */
   public branches(): Array<TreeBranch<UserlandComponent>> {
      return this.treeNodeBase.branches();
   }

   /**
    * Recursively destroys all descendant branches, as well as itself. This
    * releases all resources held or consumed by this branch and its descendants.
    *
    * @remarks
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
    * @remarks
    * Caution: It is not recommended to manually emit TreeEvents that are already
    * provided by the library. For example, it is not recommended to emit a
    * `GraftEvent`, `DestructionEvent`, etc. These events may be used by the tree,
    * and emitting them manually may cause unexpected behavior. Instead, we
    * recommend implementing the TreeEvent interface with your own custom events
    * and dispatching those.
    *
    * @param event - The TreeEvent that will be emitted.
    */
   public dispatch(event: TreeEvent<UserlandComponent>): void {
      this.treeNodeBase.dispatch(event);
      this._parent?.dispatch(event);
   }

   /**
    * @returns
    * An observable that emits TreeEvents whenever an event is dispatched
    * in this branch or any of its descendant branches.
    */
   public events(): Observable<TreeEvent<UserlandComponent>> {
      return this.treeNodeBase.events();
   }

   /**
    * @param index - The index of the child branch to retrieve.
    *
    * @returns
    * The child branch at the specified index, or undefined if there is
    * no child branch at the specified index.
    */
   public getBranch(index: number): TreeBranch<UserlandComponent> | undefined {
      return this.treeNodeBase.getBranch(index);
   }

   /** @returns The ViewContainerRef in which child branches are rendered */
   public getBranchesContainer(): ViewContainerRef | undefined {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get branches container from a destroyed tree branch"
         );
      }
      return this.branchController.getBranchesContainer();
   }

   /** @returns The instance of BranchComponent that is rendered by this class. */
   public getComponentInstance(): BranchComponent<UserlandComponent> {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get component instance from a destroyed tree branch"
         );
      }
      return this.branchController.getComponentInstance();
   }

   /** @returns The Host View in which the BranchComponent is rendered */
   public getHostView(): ViewRef {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get component host view from a destroyed tree branch"
         );
      }
      return this.branchController.getHostView();
   }

   /** @returns The BranchComponent as a native HTML Element */
   public getNativeElement(): HTMLElement {
      if (this.isDestroyed()) {
         throw new TreeError(
            "Cannot get native element from a destroyed tree branch"
         );
      }
      return this.branchController.getNativeElement();
   }

   /**
    * @returns
    * A ComponentRef containing the instance of the user-provided
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
    * Attaches a branch to a new parent node.
    *
    * @remarks
    * If not already pruned, this method prunes (removes) this branch from its
    * current position in the tree; then grafts (reattaches) it as a child of the
    * specified parent branch at the specified index. If no index is specified,
    * the branch is appended as the last child of the parent. This causes this
    * branch's associated BranchComponent to be re-rendered in the DOM at the
    * new location.
    *
    * @param newParent - The new parent branch unto which this branch will be grafted.
    * @param index - The index at which this branch will be grafted. If not specified,
    * this branch will be appended as the last child of the new parent.
    *
    * @returns The index at which this branch was grafted.
    */
   public graftTo(
      newParent: TreeNode<UserlandComponent>,
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
    *
    * @param component - The component to render in the new child branch.
    * @param options - Configuration options for the new child branch.
    *
    * @returns
    * The newly-created child branch.
    */
   public grow(
      component: Type<UserlandComponent>,
      options?: BranchOptions<UserlandComponent>
   ): TreeBranch<UserlandComponent> {
      if (this.isDestroyed()) {
         throw new TreeError("Cannot grow a branch on a destroyed tree branch");
      }
      try {
         return new TreeBranch(this, { component, ...options });
      } catch (error: unknown) {
         this.handleUserlandError(error);
      }
   }

   /**
    * Determines this branch's index in relation to its sibling branches.
    *
    * @remarks
    * For example, if it is the first child of its parent, this method will return
    * 0. If it is the second child of its parent, this method will return 1.
    *
    * If this branch has no parent, (eg, if this branch has been pruned) this
    * method will return undefined.
    *
    * @returns
    * The index of this branch in relation to its sibling branches, or undefined.
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

   /** @returns `true` if the branch is destroyed, `false` otherwise */
   public isDestroyed(): boolean {
      return this.treeNodeBase.isDestroyed();
   }

   /**
    * @returns
    * The data that was passed into the `branchOptions`' `meta` property
    * at construction.
    */
   public meta(): Record<string, any> {
      return this.branchOptions.meta ?? {};
   }

   /**
    * @returns
    * This branch's parent node (which may be a TreeBranch or TreeRoot).
    * If this branch has no parent, (eg, if this branch has been pruned) this
    * method will return undefined.
    */
   public parent(): TreeNode<UserlandComponent> | undefined {
      return this._parent;
   }

   /**
    * Provides a model describing this branch's descendants.
    *
    * @returns
    * A multi-dimensional Map which describes the shape of this branch's
    * descendants.
    *
    * @example
    * A branch with no children will return an empty Map. A branch with
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
    * Calculates the branch's position in the tree relative to the Root.
    *
    * @remarks
    * The position is described as an array of numbers, where each number
    * represents the index of the branch at that level of the tree.
    *
    * For example, if this branch is the first child of the Root, this method
    * will return [0]. If this branch is the second child of the first child
    * of the Root, this method will return [0, 1].
    *
    * If the branch is not related to a TreeRoot, (such as when it has been
    * pruned,) this method will throw an error.
    *
    * @returns
    * An array of numbers which describe the branch's position in the tree
    * relative to the Root.
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
    * Removes a branch from its tree without destroying it.
    *
    * @remarks
    * Removes this branch from its parent and detaches its associated
    * BranchComponent from the DOM. This puts the branch in a "pruned" state,
    * which may affect the behavior of other methods.
    *
    * A pruned branch can be reattached to any other node using the `graftTo` method.
    *
    * @returns
    * Itself, or undefined if it is already in a pruned state.
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
    * Get the root of the tree to which this Branch is attached.
    *
    * @returns
    * The TreeRoot of the tree this branch is in. If this branch is
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
    *
    * @param callback - A function to execute on each node.
    */
   public traverse(
      callback: (node: TreeNode<UserlandComponent>) => void
   ): void {
      callback(this);
      this.treeNodeBase.traverse(callback);
   }

   private checkGraftLocationValidity(
      newParent: TreeNode<UserlandComponent>,
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

   private handleUserlandError(error: unknown): never {
      // When an error occurs in a userland component during a tree operation,
      // it can cause undefined, bizarre behavior in the tree. To prevent this,
      // we destroy the tree and throw an error instead. This helps protect
      // the end-user's data from corruption.
      this.furthestAncestor().destroy();
      this.treeNodeBase.handleUserlandError(error);
   }

   private indexIsOutOfRange(
      parent: TreeNode<UserlandComponent>,
      index: number
   ): boolean {
      return index < 0 || index > parent.branches().length;
   }

   private furthestAncestor(): TreeNode<UserlandComponent> {
      // eslint-disable-next-line @typescript-eslint/no-this-alias -- This code is for an iteration, not to make `this` available in other scopes (which is what the rule is intended to protect against).
      let node: TreeNode<UserlandComponent> = this;
      while (node instanceof TreeBranch) {
         const parent = node.parent();
         if (parent === undefined) break;
         node = parent;
      }
      return node;
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

   private setIndentation(parent: TreeNode<UserlandComponent>): void {
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
