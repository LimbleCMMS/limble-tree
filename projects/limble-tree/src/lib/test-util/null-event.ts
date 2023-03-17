import type { TreeEvent, TreeNode } from "../structure";

export function createNullEvent(source: TreeNode<unknown, unknown>): TreeEvent {
   return { source: () => source };
}
