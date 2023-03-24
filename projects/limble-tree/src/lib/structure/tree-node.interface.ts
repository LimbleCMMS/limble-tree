import type { Branchable } from "./branchable.interface";
import type { TreePlot } from "./tree-plot";
import type { TreeRoot } from "../core";
import type { ComponentContainer } from "./component-container.interface";
import type { Observable } from "rxjs";
import type { TreeEvent } from "./tree-event.interface";

export interface TreeNode<Children, Component>
   extends Branchable<Children>,
      ComponentContainer<Component> {
   destroy: () => void;
   dispatch: (event: TreeEvent) => void;
   events: () => Observable<TreeEvent>;
   isDestroyed: () => boolean;
   plot: () => TreePlot;
   root: () => TreeRoot<any> | undefined;
   traverse: (callback: (node: Branchable<Children>) => void) => void;
}
