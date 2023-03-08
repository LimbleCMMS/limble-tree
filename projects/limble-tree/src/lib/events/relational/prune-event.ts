import type { EventConduit, TreeRelationship } from "../../structure";
import type { RelationalTreeEvent } from "./relational-tree-event.interface";

/** Emitted when a branch is pruned from its parent branch */
export class PruneEvent<T extends TreeRelationship<any, any>>
   implements RelationalTreeEvent<T["parent"], T["child"]>
{
   private readonly _source: EventConduit;
   private readonly _parent: T["parent"];
   private readonly _child: T["child"];
   private readonly _index: number;

   public constructor(source: EventConduit, relationship: T) {
      this._source = source;
      this._child = relationship.child;
      this._parent = relationship.parent;
      this._index = relationship.index;
   }

   public child(): T["child"] {
      return this._child;
   }

   public index(): number {
      return this._index;
   }

   public parent(): T["parent"] {
      return this._parent;
   }

   public source(): EventConduit {
      return this._source;
   }
}
