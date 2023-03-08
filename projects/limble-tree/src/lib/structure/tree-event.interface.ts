import type { EventConduit } from "./event-conduit.interface";

/** An event emitted by a node in the tree */
export interface TreeEvent {
   /**  Gets the source of the event */
   source: () => EventConduit;
}
