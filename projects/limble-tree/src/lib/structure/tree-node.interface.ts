import { Branchable } from "../relationships/branchable.interface";
import { EventConduit } from "../events/event-conduit.interface";
import { TreePlot } from "./tree-plot";

export interface TreeNode<T> extends EventConduit, Branchable<T> {
   plot: () => TreePlot;
   traverse: (callback: (node: Branchable<T>) => void) => void;
}
