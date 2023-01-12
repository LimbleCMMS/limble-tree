import { TreeNode } from "../tree-node.interface";
import { ContentContainer } from "./content-container.interface";
import { Graftable } from "../../relationships/graftable.interface";

export type TreeBranchNode<T, U> = TreeNode<U> &
   Graftable<TreeNode<U>> &
   ContentContainer<T> & {
      position: () => Array<number>;
   };
