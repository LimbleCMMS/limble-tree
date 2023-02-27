import { EventConduit } from "./event-conduit.interface";

export interface TreeEvent {
   type: () => string;
   source: () => EventConduit;
}
