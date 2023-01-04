import { TreeNode } from "../structure/tree-node.interface";

export interface TreeEvent<T> {
   readonly source: TreeNode<T>;
}
