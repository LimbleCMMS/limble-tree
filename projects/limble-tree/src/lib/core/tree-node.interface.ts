import type { TreeRoot } from "./tree-root";
import type { TreePlot } from "./tree-plot.interface";
import type { Branchable } from "./branchable.interface";
import type { ComponentContainer } from "./component-container.interface";
import type { Observable } from "rxjs";
import type { TreeEvent } from "../events";
import type { NodeComponent } from "../components";

export interface TreeNode<UserlandComponent>
   extends Branchable<UserlandComponent>,
      ComponentContainer<NodeComponent> {
   destroy: () => void;
   dispatch: (event: TreeEvent<UserlandComponent>) => void;
   events: () => Observable<TreeEvent<UserlandComponent>>;
   isDestroyed: () => boolean;
   plot: () => TreePlot;
   root: () => TreeRoot<any> | undefined;
   traverse: (callback: (node: Branchable<UserlandComponent>) => void) => void;
}
