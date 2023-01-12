import { Branchable } from "./branchable.interface";
import { Graftable } from "./graftable.interface";

export interface TreeRelationship<
   Parent extends Branchable<Child>,
   Child extends Graftable<Parent>
> {
   parent: Parent;
   child: Child;
   index: number;
}
