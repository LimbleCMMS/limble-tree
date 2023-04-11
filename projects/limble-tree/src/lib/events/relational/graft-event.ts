import type { RelationalTreeEvent } from "./relational-tree-event.interface";
import type { TreeRelationship } from "./tree-relationship.interface";
import type { TreeBranch, TreeNode } from "../../core";

/** Emits when a branch is grafted to another tree node */
export class GraftEvent<UserlandComponent>
   implements RelationalTreeEvent<UserlandComponent>
{
   private readonly _source: TreeBranch<UserlandComponent>;
   private readonly _parent: TreeNode<UserlandComponent>;
   private readonly _child: TreeBranch<UserlandComponent>;
   private readonly _index: number;

   public constructor(
      source: TreeBranch<UserlandComponent>,
      relationship: TreeRelationship<UserlandComponent>
   ) {
      this._source = source;
      this._child = relationship.child;
      this._parent = relationship.parent;
      this._index = relationship.index;
   }

   public child(): TreeBranch<UserlandComponent> {
      return this._child;
   }

   public index(): number {
      return this._index;
   }

   public parent(): TreeNode<UserlandComponent> {
      return this._parent;
   }

   public source(): TreeBranch<UserlandComponent> {
      return this._source;
   }
}
