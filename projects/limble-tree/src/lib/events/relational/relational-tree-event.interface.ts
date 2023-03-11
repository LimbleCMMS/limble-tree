import type { TreeEvent } from "../../structure/tree-event.interface";

/** A TreeEvent which involves a parent/child relationship */
export interface RelationalTreeEvent<Parent, Child> extends TreeEvent {
   /** @returns The parent branch of the relationship */
   parent: () => Parent;
   /** @returns The child branch of the relationship */
   child: () => Child;
   /** @returns The index location of the child */
   index: () => number;
}
