import type { TreeEvent } from "../../structure/tree-event.interface";

/** A TreeEvent which involves a parent/child relationship */
export interface RelationalTreeEvent<Parent, Child> extends TreeEvent {
   /** Gets the parent branch of the relationship */
   parent: () => Parent;
   /** Gets the child branch of the relationship */
   child: () => Child;
   /** Gets the index location of the child */
   index: () => number;
}
