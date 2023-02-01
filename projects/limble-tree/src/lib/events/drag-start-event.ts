import { EventConduit } from "./event-conduit.interface";
import { TreeEvent } from "./tree-event.interface";

export class DragStartEvent implements TreeEvent {
   private readonly _source: EventConduit;

   public constructor(source: EventConduit) {
      this._source = source;
   }

   public type(): "drag start" {
      return "drag start";
   }

   public source(): EventConduit {
      return this._source;
   }
}
