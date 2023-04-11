import type { TreeBranch, TreeNode } from "../../core";
import type { TreeEvent } from "../tree-event.interface";

/** A TreeEvent which involves a parent/child relationship */
export interface RelationalTreeEvent<UserlandComponent>
   extends TreeEvent<UserlandComponent> {
   /** @returns The parent branch of the relationship */
   parent: () => TreeNode<UserlandComponent>;
   /** @returns The child branch of the relationship */
   child: () => TreeBranch<UserlandComponent>;
   /** @returns The index location of the child */
   index: () => number;
}
