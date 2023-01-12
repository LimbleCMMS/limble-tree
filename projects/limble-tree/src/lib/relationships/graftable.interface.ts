export interface Graftable<T> {
   graftTo: (newParent: T, index?: number) => number;
   index: () => number;
   parent: () => T;
   prune: () => void;
}
