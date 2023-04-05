import type { TreeNode } from "../core";
import type { TreeEvent } from "../events";

export function createNullEvent<T>(source: TreeNode<T>): TreeEvent<T> {
   return { source: () => source };
}
