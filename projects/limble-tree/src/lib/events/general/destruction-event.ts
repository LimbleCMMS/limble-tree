import type { TreeNode } from "../../core";
import type { TreeEvent } from "../../events";

/** Emitted when a node is destroyed */
export class DestructionEvent<T> implements TreeEvent<T> {
   private readonly _source: TreeNode<T>;

   public constructor(source: TreeNode<T>) {
      this._source = source;
   }

   public source(): TreeNode<T> {
      return this._source;
   }
}
