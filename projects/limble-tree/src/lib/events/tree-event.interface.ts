import { EventConduit } from "./event-conduit.interface";

export interface TreeEvent {
   source: () => EventConduit;
}
