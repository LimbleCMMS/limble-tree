import { Branchable } from "../branchable.interface";
import { EventConduit } from "../../events/event-conduit.interface";
import { TreePlot } from "../tree-plot";

export interface TreeNode<Children> extends EventConduit, Branchable<Children> {
   plot: () => TreePlot;
   traverse: (callback: (node: Branchable<Children>) => void) => void;
}
