import { Branchable } from "./branchable.interface";
import { EventConduit } from "./event-conduit.interface";
import { TreePlot } from "./tree-plot";
import { TreeRoot } from "../core";

export interface TreeNode<Children> extends EventConduit, Branchable<Children> {
   plot: () => TreePlot;
   traverse: (callback: (node: Branchable<Children>) => void) => void;
   root: () => TreeRoot<any> | undefined;
   isDestroyed: () => boolean;
}
