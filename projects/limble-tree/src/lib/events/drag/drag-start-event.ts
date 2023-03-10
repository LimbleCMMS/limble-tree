import { NodeComponent } from "../../components/node-component.interface";
import { TreeNode } from "../../structure";
import { TreeEvent } from "../../structure/tree-event.interface";

export class DragStartEvent implements TreeEvent {
   private readonly _source: TreeNode<unknown, NodeComponent>;

   public constructor(source: TreeNode<unknown, NodeComponent>) {
      this._source = source;
   }

   public type(): "drag start" {
      return "drag start";
   }

   public source(): TreeNode<unknown, NodeComponent> {
      return this._source;
   }
}
