import { TreePlot } from "../../shared/tree-plot";
import { TreeEvent } from "../events/tree-event.interface";
import { Branchable } from "./branchable/branchable.interface";
import { EventConduit } from "./event-conduit.interface";

export interface TreeNode<T>
   extends EventConduit<TreeEvent<T>>,
      Branchable<TreeNode<T>> {
   plot: () => TreePlot;
   position: () => Array<number>;
   traverse: (callback: (branch: TreeNode<T>) => void) => void;
}
