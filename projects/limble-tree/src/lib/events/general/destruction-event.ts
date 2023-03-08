import type { EventConduit, TreeEvent } from "../../structure";

/** Emitted when a node is destroyed */
export class DestructionEvent implements TreeEvent {
   private readonly _source: EventConduit;

   public constructor(source: EventConduit) {
      this._source = source;
   }

   public source(): EventConduit {
      return this._source;
   }
}
