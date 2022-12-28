import { ComponentRef } from "@angular/core";
import { assert } from "../../../shared/assert";
import { BranchComponent } from "../../components/branch/branch.component";
import { TreeBranch } from "../../structure/tree-branch/tree-branch";
import { TreeNode } from "../../structure/tree-node";
import { TreeRoot } from "../../structure/tree-root/tree-root";
import { TreeError } from "../errors/tree-error";
import { NodeRef } from "../node-ref";
import { Tree } from "../tree/tree";

export class TreeCursor {
   private target: TreeNode<NodeRef>;
   private _tree: Tree;

   public constructor(tree: Tree, root: TreeRoot<NodeRef>) {
      this._tree = tree;
      this.target = root;
      assert(this.target.getContents() instanceof ComponentRef);
   }

   public atRoot(): boolean {
      return this.isRoot(this.target);
   }

   public growBranch(): number {
      //FIXME: law of demeter?
      const container = this.target.getContents()?.instance?.branchesContainer;
      assert(container !== undefined);
      const componentRef = container.createComponent(BranchComponent);
      componentRef.changeDetectorRef.detectChanges();
      const branch = new TreeBranch<NodeRef>(componentRef);
      branch.graftTo(this.target);
      return branch.index();
   }

   public position(): Array<number> {
      return this.target.position();
   }

   public prune(): Tree {
      if (!this.isBranch(this.target)) {
         throw new TreeError(`Cannot prune the root of the tree.`);
      }
      const newRoot = this.target.prune();
      const newTree = new Tree(newRoot);
      this._tree = newTree;
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
         console.warn(
            "Cannot step out. Cursor is at the root of the tree. No action is taken."
         );
         return;
      }
      this.target = this.target.parent();
   }

   public stepForward(): void {
      if (!this.isBranch(this.target)) {
         console.warn(
            "Cannot step forward. Cursor is at the root of the tree. No action is taken."
         );
         return;
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
         console.warn(
            "Cannot step backward. Cursor is at the root of the tree. No action is taken."
         );
         return;
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

   private isBranch<T>(node: TreeNode<T>): node is TreeBranch<T> {
      return node instanceof TreeBranch;
   }

   private isRoot<T>(node: TreeNode<T>): node is TreeRoot<T> {
      return node instanceof TreeRoot;
   }
}
