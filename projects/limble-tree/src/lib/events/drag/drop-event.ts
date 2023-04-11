import type { TreeNode } from "../../core";
import type { TreeEvent } from "../../events";

/** Emitted when a TreeBranch is dropped into a valid Dropzone */
export class DropEvent<T> implements TreeEvent<T> {
   private readonly _source: TreeNode<T>;
   private readonly _parent: TreeNode<T>;
   private readonly _index: number;

   public constructor(source: TreeNode<T>, parent: TreeNode<T>, index: number) {
      this._source = source;
      this._parent = parent;
      this._index = index;
   }

   public source(): TreeNode<T> {
      return this._source;
   }

   public index(): number {
      return this._index;
   }

   public parent(): TreeNode<T> {
      return this._parent;
   }
}
