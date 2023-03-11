import type { NodeComponent } from "../../components/node-component.interface";
import type { TreeBranch } from "../../core";
import type { TreeNode } from "../../structure";
import type { TreeEvent } from "../../structure/tree-event.interface";

/** Emitted when a drag-and-drop operation has completed */
export class DragEndEvent<T> implements TreeEvent {
   private readonly _source: TreeNode<TreeBranch<T>, NodeComponent>;
   private readonly _newParent: TreeNode<TreeBranch<T>, NodeComponent>;
   private readonly _newIndex: number;
   private readonly _oldParent: TreeNode<TreeBranch<T>, NodeComponent>;
   private readonly _oldIndex: number;

   public constructor(
      source: TreeNode<TreeBranch<T>, NodeComponent>,
      endpoints: {
         oldParent: TreeNode<TreeBranch<T>, NodeComponent>;
         oldIndex: number;
         newParent: TreeNode<TreeBranch<T>, NodeComponent>;
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
   public newParent(): TreeNode<TreeBranch<T>, NodeComponent> {
      return this._newParent;
   }

   /** @returns The index of the dropped branch before it was dragged */
   public oldIndex(): number {
      return this._oldIndex;
   }

   /** @returns The parent of the dropped branch before it was dragged */
   public oldParent(): TreeNode<TreeBranch<T>, NodeComponent> {
      return this._oldParent;
   }

   public source(): TreeNode<TreeBranch<T>, NodeComponent> {
      return this._source;
   }
}
