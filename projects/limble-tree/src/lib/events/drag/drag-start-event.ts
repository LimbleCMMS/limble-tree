import type { NodeComponent } from "../../components/node-component.interface";
import type { TreeNode } from "../../structure";
import type { TreeEvent } from "../../structure/tree-event.interface";

/** Emitted when a TreeBranch begins being dragged */
export class DragStartEvent implements TreeEvent {
   private readonly _source: TreeNode<unknown, NodeComponent>;

   public constructor(source: TreeNode<unknown, NodeComponent>) {
      this._source = source;
   }

   public source(): TreeNode<unknown, NodeComponent> {
      return this._source;
   }
}
