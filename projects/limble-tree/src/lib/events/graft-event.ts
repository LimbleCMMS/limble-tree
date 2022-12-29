import { TreeBranch } from "../structure/tree-branch/tree-branch";
import { TreeRelationship } from "../structure/tree-relationship/tree-relationship";
import { TreeEvent } from "./tree-event";

export class GraftEvent<T> implements TreeEvent<T> {
   public readonly source: TreeBranch<T>;

   public constructor(
      public readonly newRelationship: TreeRelationship<T>,
      public readonly index: number
   ) {
      this.source = newRelationship.getChild();
   }
}
