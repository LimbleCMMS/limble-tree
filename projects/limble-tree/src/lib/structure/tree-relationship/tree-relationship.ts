import { TreeBranch } from "../tree-branch/tree-branch";
import { TreeNode } from "../tree-node";

//FIXME: Is this class necessary? Looks like a "Data Class" smell
export class TreeRelationship<T> {
   public constructor(
      private parent: TreeNode<T>,
      private readonly child: TreeBranch<T>
   ) {}

   public getChild(): TreeBranch<T> {
      return this.child;
   }

   public getParent(): TreeNode<T> {
      return this.parent;
   }

   public setParent(node: TreeNode<T>): void {
      this.parent = node;
   }
}
