import { NodeComponent } from "../../components/node-component.interface";
import { TreeBranch } from "../../core";
import { TreeNode, TreeEvent } from "../../structure";

export class DropEvent<T> implements TreeEvent {
   private readonly _source: TreeNode<TreeBranch<T>, NodeComponent>;
   private readonly _parent: TreeNode<TreeBranch<T>, NodeComponent>;
   private readonly _index: number;

   public constructor(
      source: TreeNode<TreeBranch<T>, NodeComponent>,
      parent: TreeNode<TreeBranch<T>, NodeComponent>,
      index: number
   ) {
      this._source = source;
      this._parent = parent;
      this._index = index;
   }

   public type(): "drag end" {
      return "drag end";
   }

   public source(): TreeNode<TreeBranch<T>, NodeComponent> {
      return this._source;
   }

   public index(): number {
      return this._index;
   }

   public parent(): TreeNode<TreeBranch<T>, NodeComponent> {
      return this._parent;
   }
}
