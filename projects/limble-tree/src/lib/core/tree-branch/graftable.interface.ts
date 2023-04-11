import type { TreeNode } from "../tree-node.interface";

export interface Graftable<UserlandComponent> {
   graftTo: (newParent: TreeNode<UserlandComponent>, index?: number) => number;
   index: () => number | undefined;
   parent: () => TreeNode<UserlandComponent> | undefined;
   prune: () => void;
}
