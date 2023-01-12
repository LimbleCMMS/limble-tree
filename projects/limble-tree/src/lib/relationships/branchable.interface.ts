export interface Branchable<T> {
   branches: () => Array<T>;
   deleteBranch: (index?: number) => void;
   getBranch: (index: number) => T | undefined;
   // growBranch: (index?: number) => T;
}
