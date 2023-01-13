import { ComponentRef } from "@angular/core";
import { NodeComponent } from "../components/node-component.interface";
import { ContainerTreeNode } from "../structure/nodes/container-tree-node.interface";
import { TreeRelationship } from "../structure/tree-relationship.interface";
import { TreeBranch } from "./tree-branch/tree-branch";

export type Relationship = TreeRelationship<
   ContainerTreeNode<ComponentRef<NodeComponent>, TreeBranch<unknown>>,
   TreeBranch<unknown>
>;
