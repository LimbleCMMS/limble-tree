import { NodeComponent } from "../components/node-component.interface";
import { TreeNode } from "../structure";
import { TreeRelationship } from "../structure/tree-relationship.interface";
import { TreeBranch } from "./tree-branch/tree-branch";

export type Relationship<UserlandComponent> = TreeRelationship<
   TreeNode<TreeBranch<UserlandComponent>, NodeComponent>,
   TreeBranch<UserlandComponent>
>;
