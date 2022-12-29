import { TreePlot } from "../../../shared/tree-plot";
import { TreeRoot } from "../../structure/tree-root/tree-root";
import { NodeRef } from "../node-ref";
import { TreeCursor } from "../tree-cursor/tree-cursor";

export class Tree {
   private readonly _root: TreeRoot<NodeRef>;

   public constructor(root: TreeRoot<NodeRef>) {
      this._root = root;
   }

   public getCursor(): TreeCursor {
      return new TreeCursor(this);
   }

   public count(): number {
      let count = -1;
      this.root().traverse(() => {
         count++;
      });
      return count;
   }

   public plot(): TreePlot {
      return this.root().plot();
   }

   public root(): TreeRoot<NodeRef> {
      return this._root;
   }
}
