export interface Graftable<Parent> {
   graftTo: (newParent: Parent, index?: number) => number;
   index: () => number | undefined;
   parent: () => Parent | undefined;
   prune: () => void;
}
