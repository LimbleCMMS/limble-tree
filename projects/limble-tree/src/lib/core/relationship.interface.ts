import { TreeRelationship } from "../relationships/tree-relationship.interface";
import { TreeNode } from "../structure/tree-node.interface";
import { TreeBranch } from "./tree-branch/tree-branch";

export type Relationship = TreeRelationship<
   TreeNode<TreeBranch<unknown>>,
   TreeBranch<unknown>
>;
