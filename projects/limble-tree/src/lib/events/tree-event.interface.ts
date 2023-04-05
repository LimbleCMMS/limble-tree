import type { TreeNode } from "../core";

/** An event emitted by a node in the tree */
export interface TreeEvent<UserlandComponent> {
   source: () => TreeNode<UserlandComponent>;
}
