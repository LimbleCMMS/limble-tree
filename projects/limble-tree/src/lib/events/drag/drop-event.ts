import type { NodeComponent } from "../../components/node-component.interface";
import type { TreeBranch } from "../../core";
import type { TreeNode, EventConduit, TreeEvent } from "../../structure";

/** Emitted when a TreeBranch is dropped into a valid Dropzone */
export class DropEvent<T> implements TreeEvent {
   private readonly _source: EventConduit;
   private readonly _parent: TreeNode<TreeBranch<T>, NodeComponent>;
   private readonly _index: number;

   public constructor(
      source: EventConduit,
      parent: TreeNode<TreeBranch<T>, NodeComponent>,
      index: number
   ) {
      this._source = source;
      this._parent = parent;
      this._index = index;
   }

   public source(): EventConduit {
      return this._source;
   }

   public index(): number {
      return this._index;
   }

   public parent(): TreeNode<TreeBranch<T>, NodeComponent> {
      return this._parent;
   }
}
