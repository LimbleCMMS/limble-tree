import { Branchable } from "./branchable.interface";
import { EventConduit } from "./event-conduit.interface";
import { TreePlot } from "./tree-plot";
import { TreeRoot } from "../core";
import { ComponentContainer } from "./component-container.interface";

export interface TreeNode<Children, Component>
   extends EventConduit,
      Branchable<Children>,
      ComponentContainer<Component> {
   plot: () => TreePlot;
   traverse: (callback: (node: Branchable<Children>) => void) => void;
   root: () => TreeRoot<any> | undefined;
   isDestroyed: () => boolean;
}
