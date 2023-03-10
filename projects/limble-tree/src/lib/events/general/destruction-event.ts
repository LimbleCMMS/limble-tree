import type { NodeComponent } from "../../components/node-component.interface";
import type { TreeNode, TreeEvent } from "../../structure";

/** Emitted when a node is destroyed */
export class DestructionEvent implements TreeEvent {
   private readonly _source: TreeNode<unknown, NodeComponent>;

   public constructor(source: TreeNode<unknown, NodeComponent>) {
      this._source = source;
   }

   public source(): TreeNode<unknown, NodeComponent> {
      return this._source;
   }
}
