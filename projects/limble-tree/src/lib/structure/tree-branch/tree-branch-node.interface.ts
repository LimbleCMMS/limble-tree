import { Branchable } from "../branchable/branchable.interface";
import { TreeNode } from "../tree-node.interface";
import { ContentContainer } from "./content-container.interface";
import { Graftable } from "./graftable.interface";

export type TreeBranchNode<T> = TreeNode<T> &
   Branchable<TreeBranchNode<T>> &
   Graftable<TreeNode<T>> &
   ContentContainer<T>;
