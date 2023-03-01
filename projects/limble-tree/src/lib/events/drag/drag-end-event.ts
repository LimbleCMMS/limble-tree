import { NodeComponent } from "../../components/node-component.interface";
import { TreeBranch } from "../../core";
import { TreeNode } from "../../structure";
import { EventConduit } from "../../structure/event-conduit.interface";
import { TreeEvent } from "../../structure/tree-event.interface";

export class DragEndEvent<T> implements TreeEvent {
   private readonly _source: EventConduit;
   private readonly _newParent: TreeNode<TreeBranch<T>, NodeComponent>;
   private readonly _newIndex: number;
   private readonly _oldParent: TreeNode<TreeBranch<T>, NodeComponent>;
   private readonly _oldIndex: number;

   public constructor(
      source: EventConduit,
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

   public type(): "drag end" {
      return "drag end";
   }

   public source(): EventConduit {
      return this._source;
   }

   public newIndex(): number {
      return this._newIndex;
   }

   public newParent(): TreeNode<TreeBranch<T>, NodeComponent> {
      return this._newParent;
   }

   public oldIndex(): number {
      return this._oldIndex;
   }

   public oldParent(): TreeNode<TreeBranch<T>, NodeComponent> {
      return this._oldParent;
   }
}
