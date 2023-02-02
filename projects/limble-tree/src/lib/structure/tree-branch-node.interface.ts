import { Graftable } from "./graftable.interface";
import { ContainerTreeNode } from "./container-tree-node.interface";

export type TreeBranchNode<Contents, Children, ParentContents> =
   ContainerTreeNode<Contents, Children> &
      Graftable<ContainerTreeNode<ParentContents, Children>> & {
         position: () => Array<number>;
      };
