import type { EventConduit, TreeEvent } from "../../structure";

/** Emitted when a TreeBranch begins being dragged */
export class DragStartEvent implements TreeEvent {
   private readonly _source: EventConduit;

   public constructor(source: EventConduit) {
      this._source = source;
   }

   public source(): EventConduit {
      return this._source;
   }
}
