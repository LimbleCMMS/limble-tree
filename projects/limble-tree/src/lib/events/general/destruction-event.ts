import { NodeComponent } from "../../components/node-component.interface";
import { TreeNode, TreeEvent } from "../../structure";

export class DestructionEvent implements TreeEvent {
   private readonly _source: TreeNode<unknown, NodeComponent>;

   public constructor(source: TreeNode<unknown, NodeComponent>) {
      this._source = source;
   }

   public type(): "destruction" {
      return "destruction";
   }

   public source(): TreeNode<unknown, NodeComponent> {
      return this._source;
   }
}
