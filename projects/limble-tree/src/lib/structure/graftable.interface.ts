export interface Graftable<Parent> {
   graftTo: (newParent: Parent, index?: number) => number;
   index: () => number;
   parent: () => Parent;
   prune: () => void;
}
