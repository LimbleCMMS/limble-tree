import { EventConduit } from "../../structure/event-conduit.interface";
import { TreeEvent } from "../../structure/tree-event.interface";

export class DragEndEvent implements TreeEvent {
   private readonly _source: EventConduit;

   public constructor(source: EventConduit) {
      this._source = source;
   }

   public type(): "drag end" {
      return "drag end";
   }

   public source(): EventConduit {
      return this._source;
   }
}
