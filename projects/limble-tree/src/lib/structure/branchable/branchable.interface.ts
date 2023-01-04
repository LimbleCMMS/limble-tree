export interface Branchable<T> {
   branches: () => Array<T>;
   // growBranch: (index?: number) => T;
   // getBranch: (index: number) => T;
}
