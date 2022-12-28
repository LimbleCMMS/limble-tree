import { Observable } from "rxjs";
import { TreePlot } from "../../shared/tree-plot";
import { TreeEvent } from "../events/tree-event";
import { TreeBranch } from "./tree-branch/tree-branch";

export interface TreeNode<T> {
   branches: () => Array<TreeBranch<T>>;
   event: (event: TreeEvent<T>) => void;
   events: () => Observable<TreeEvent<T>>;
   getContents: () => T | undefined;
   plot: () => TreePlot;
   position: () => Array<number>;
   setContents: (contents: T) => void;
   traverse: (callback: (branch: TreeNode<T>) => void) => void;
}
