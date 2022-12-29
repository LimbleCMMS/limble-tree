import { ComponentRef, Type, ViewContainerRef } from "@angular/core";
import { assert } from "../../../shared/assert";
import { BranchComponent } from "../../components/branch/branch.component";
import { TreeBranch } from "../../structure/tree-branch/tree-branch";
import { TreeNode } from "../../structure/tree-node";
import { TreeRoot } from "../../structure/tree-root/tree-root";
import { TreeError } from "../errors/tree-error";
import { NodeRef } from "../node-ref";
import { Tree } from "../tree/tree";
import { BranchOptions } from "./branch-options";

export class TreeCursor {
   private target: TreeNode<NodeRef>;
   private readonly _tree: Tree;

   public constructor(tree: Tree) {
      this._tree = tree;
      this.target = tree.root();
      assert(this.target.getContents() instanceof ComponentRef);
   }

   public atRoot(): boolean {
      return this.isRoot(this.target);
   }

   public graft(tree: Tree): void {
      //FIXME: Law of demeter?
      for (const branch of tree.root().branches()) {
         //FIXME: law of demeter?
         const container = this.getBranchesContainer();
         container.insert(branch.getContents().hostView);
         branch.graftTo(this.target);
      }
   }

   public graftAt(index: number, tree: Tree): void {
      if (index < 0 || index > this.target.branches().length) {
         throw new TreeError(`Can't graft at index ${index}. Out of range.`);
      }
      let insertIndex = index;
      //FIXME: Law of demeter?
      for (const branch of tree.root().branches()) {
         //FIXME: law of demeter?
         const container = this.getBranchesContainer();
         container.insert(branch.getContents().hostView, insertIndex);
         branch.graftTo(this.target, insertIndex);
         insertIndex++;
      }
   }

   public growBranch<T>(options: BranchOptions<T>): number {
      const nodeRef = this.insertComponent(options.component);
      const branch = new TreeBranch<NodeRef>(nodeRef);
      branch.graftTo(this.target);
      return branch.index();
   }

   public jumpTo(position: Array<number>): void {
      let target: TreeNode<NodeRef> = this.tree().root();
      for (const index of position) {
         target = target.branches()[index];
         if (target === undefined) {
            throw new TreeError(
               `Cannot jump to non-existent position [${position.join(", ")}]`
            );
         }
      }
      this.target = target;
   }

   public position(): Array<number> {
      return this.target.position();
   }

   public prune(): Tree {
      if (!this.isBranch(this.target)) {
         throw new TreeError(`Cannot prune the root of the tree.`);
      }
      const parent = this.target.parent();
      const parentBranchesContainer =
         parent.getContents()?.instance.branchesContainer;
      if (parentBranchesContainer === undefined) {
         throw new Error("could not get parentBranchesContainer");
      }
      parentBranchesContainer.detach(this.target.index());
      const newRoot = this.target.prune();
      const newTree = new Tree(newRoot);
      this.target = parent;
      return newTree;
   }

   public stepIn(index: number = 0): void {
      if (index < 0 || index >= this.target.branches().length) {
         throw new TreeError(
            `Cannot step into index '${index}'. Out of range.`
         );
      }
      this.target = this.target.branches()[index];
      assert(this.isBranch(this.target));
   }

   public stepOut(): void {
      if (!this.isBranch(this.target)) {
         throw new TreeError(
            "Cannot step out. Cursor is at the root of the tree."
         );
      }
      this.target = this.target.parent();
   }

   public stepForward(): void {
      if (!this.isBranch(this.target)) {
         throw new TreeError(
            "Cannot step forward. Cursor is at the root of the tree."
         );
      }
      const index = this.target.index() + 1;
      const siblings = this.target.parent().branches();
      if (index >= siblings.length) {
         this.target = this.target.parent();
         return;
      }
      this.target = siblings[index];
   }

   public stepBackward(): void {
      if (!this.isBranch(this.target)) {
         throw new TreeError(
            "Cannot step backward. Cursor is at the root of the tree."
         );
      }
      const index = this.target.index() - 1;
      if (index < 0) {
         this.target = this.target.parent();
         return;
      }
      const siblings = this.target.parent().branches();
      this.target = siblings[index];
   }

   public tree(): Tree {
      return this._tree;
   }

   private getBranchesContainer(): ViewContainerRef {
      //FIXME: law of demeter?
      const container = this.target.getContents()?.instance?.branchesContainer;
      assert(container !== undefined);
      return container;
   }

   private insertComponent<T>(component: Type<T>): NodeRef {
      const container = this.getBranchesContainer();
      const componentRef =
         container.createComponent<BranchComponent<T>>(BranchComponent);
      componentRef.instance.content = component;
      componentRef.changeDetectorRef.detectChanges();
      return componentRef;
   }

   private isBranch<T>(node: TreeNode<T>): node is TreeBranch<T> {
      return node instanceof TreeBranch;
   }

   private isRoot<T>(node: TreeNode<T>): node is TreeRoot<T> {
      return node instanceof TreeRoot;
   }
}
