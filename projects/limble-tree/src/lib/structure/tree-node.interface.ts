import type { Branchable } from "./branchable.interface";
import type { EventConduit } from "./event-conduit.interface";
import type { TreePlot } from "./tree-plot";
import type { TreeRoot } from "../core";
import type { ComponentContainer } from "./component-container.interface";

export interface TreeNode<Children, Component>
   extends EventConduit,
      Branchable<Children>,
      ComponentContainer<Component> {
   plot: () => TreePlot;
   traverse: (callback: (node: Branchable<Children>) => void) => void;
   root: () => TreeRoot<any> | undefined;
   isDestroyed: () => boolean;
}
