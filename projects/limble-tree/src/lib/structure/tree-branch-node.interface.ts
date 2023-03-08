import type { Graftable } from "./graftable.interface";
import type { TreeNode } from "./tree-node.interface";

export type TreeBranchNode<Contents, Children, ParentContents> = TreeNode<
   Children,
   Contents
> &
   Graftable<TreeNode<Children, ParentContents>> & {
      position: () => Array<number>;
   };
