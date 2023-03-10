import { Branchable } from "./branchable.interface";
import { TreePlot } from "./tree-plot";
import { TreeRoot } from "../core";
import { ComponentContainer } from "./component-container.interface";
import { Observable } from "rxjs";
import { TreeEvent } from "./tree-event.interface";

export interface TreeNode<Children, Component>
   extends Branchable<Children>,
      ComponentContainer<Component> {
   dispatch: (event: TreeEvent) => void;
   events: () => Observable<TreeEvent>;
   isDestroyed: () => boolean;
   plot: () => TreePlot;
   root: () => TreeRoot<any> | undefined;
   traverse: (callback: (node: Branchable<Children>) => void) => void;
}
