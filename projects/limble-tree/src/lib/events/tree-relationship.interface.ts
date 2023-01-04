import { TreeBranchNode } from "../structure/tree-branch/tree-branch-node.interface";
import { TreeNode } from "../structure/tree-node.interface";

export interface TreeRelationship<T> {
   parent: TreeNode<T>;
   child: TreeBranchNode<T>;
   index: number;
}
