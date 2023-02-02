import { ContentContainer } from "./content-container.interface";
import { TreeNode } from "./tree-node.interface";

export type ContainerTreeNode<Contents, Children> = TreeNode<Children> &
   ContentContainer<Contents>;
