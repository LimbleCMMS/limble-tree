import { TreeBranch } from "../structure/tree-branch/tree-branch";
import { TreeRelationship } from "../structure/tree-relationship/tree-relationship";
import { TreeEvent } from "./tree-event";

export class PruneEvent<T> implements TreeEvent<T> {
   public readonly source: TreeBranch<T>;

   public constructor(public readonly oldRelationship: TreeRelationship<T>) {
      this.source = oldRelationship.getChild();
   }
}
