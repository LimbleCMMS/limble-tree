import { TreeEvent } from "../events";
import { EventConduit } from "../structure/event-conduit.interface";

export function createNullEvent(source: EventConduit): TreeEvent {
   return { source: () => source, type: () => "test" };
}
