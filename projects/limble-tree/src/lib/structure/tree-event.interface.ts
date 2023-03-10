import { TreeNode } from "./tree-node.interface";

export interface TreeEvent {
   type: () => string;
   source: () => TreeNode<unknown, unknown>;
}
