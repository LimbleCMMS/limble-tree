import { Branchable } from "../branchable/branchable.interface";

export interface Graftable<T extends Branchable<unknown>> {
   graftTo: (graftable: T, index?: number) => number;
   index: () => number;
   parent: () => T;
   prune: () => void;
}
