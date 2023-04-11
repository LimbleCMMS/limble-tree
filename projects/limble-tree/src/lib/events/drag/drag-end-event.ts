import type { TreeNode } from "../../core";
import type { TreeEvent } from "../../events";

/** Emitted when a drag-and-drop operation has completed */
export class DragEndEvent<T> implements TreeEvent<T> {
   private readonly _source: TreeNode<T>;
   private readonly _newParent: TreeNode<T>;
   private readonly _newIndex: number;
   private readonly _oldParent: TreeNode<T>;
   private readonly _oldIndex: number;

   public constructor(
      source: TreeNode<T>,
      endpoints: {
         oldParent: TreeNode<T>;
         oldIndex: number;
         newParent: TreeNode<T>;
         newIndex: number;
      }
   ) {
      this._source = source;
      this._oldParent = endpoints.oldParent;
      this._oldIndex = endpoints.oldIndex;
      this._newParent = endpoints.newParent;
      this._newIndex = endpoints.newIndex;
   }

   /** @returns The new index of the dropped branch */
   public newIndex(): number {
      return this._newIndex;
   }

   /** @returns The new parent of the dropped branch */
   public newParent(): TreeNode<T> {
      return this._newParent;
   }

   /** @returns The index of the dropped branch before it was dragged */
   public oldIndex(): number {
      return this._oldIndex;
   }

   /** @returns The parent of the dropped branch before it was dragged */
   public oldParent(): TreeNode<T> {
      return this._oldParent;
   }

   public source(): TreeNode<T> {
      return this._source;
   }
}
