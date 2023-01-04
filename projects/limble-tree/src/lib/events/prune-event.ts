import { TreeBranchNode } from "../structure/tree-branch/tree-branch-node.interface";
import { TreeNode } from "../structure/tree-node.interface";
import { TreeEvent } from "./tree-event.interface";
import { TreeRelationship } from "./tree-relationship.interface";

export class PruneEvent<T> implements TreeEvent<T> {
   public readonly source: TreeBranchNode<T>;
   public readonly parent: TreeNode<T>;
   public readonly child: TreeBranchNode<T>;
   public readonly index: number;

   public constructor(relationship: TreeRelationship<T>) {
      this.source = relationship.child;
      this.child = relationship.child;
      this.parent = relationship.parent;
      this.index = relationship.index;
   }
}
