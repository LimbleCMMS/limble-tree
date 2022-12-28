import { TreePlot } from "../../../shared/tree-plot";
import { TreeRoot } from "../../structure/tree-root/tree-root";
import { NodeRef } from "../node-ref";
import { TreeCursor } from "../tree-cursor/tree-cursor";

export class Tree {
   public constructor(private readonly root: TreeRoot<NodeRef>) {}

   public getCursor(): TreeCursor {
      return new TreeCursor(this, this.root);
   }

   public count(): number {
      let count = -1;
      this.root.traverse(() => {
         count++;
      });
      return count;
   }

   public plot(): TreePlot {
      return this.root.plot();
   }
}
