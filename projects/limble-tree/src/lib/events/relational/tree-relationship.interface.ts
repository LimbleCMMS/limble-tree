import type { TreeBranch, TreeNode } from "../../core";

export interface TreeRelationship<UserlandComponent> {
   parent: TreeNode<UserlandComponent>;
   child: TreeBranch<UserlandComponent>;
   index: number;
}
