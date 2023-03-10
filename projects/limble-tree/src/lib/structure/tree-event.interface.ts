import type { TreeNode } from "./tree-node.interface";

/** An event emitted by a node in the tree */
export interface TreeEvent {
   source: () => TreeNode<unknown, unknown>;
}
