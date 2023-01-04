import { Branchable } from "../branchable/branchable.interface";
import { TreeBranchNode } from "../tree-branch/tree-branch-node.interface";
import { TreeNode } from "../tree-node.interface";

export type TreeRootNode<T> = TreeNode<T> & Branchable<TreeBranchNode<T>>;
