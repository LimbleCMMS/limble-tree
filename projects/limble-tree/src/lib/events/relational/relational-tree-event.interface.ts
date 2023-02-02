import { TreeEvent } from "../../structure/tree-event.interface";

export interface RelationalTreeEvent<Parent, Child> extends TreeEvent {
   parent: () => Parent;
   child: () => Child;
   index: () => number;
}
