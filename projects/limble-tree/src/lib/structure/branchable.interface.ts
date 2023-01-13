export interface Branchable<Child> {
   branches: () => Array<Child>;
   deleteBranch: (index?: number) => void;
   getBranch: (index: number) => Child | undefined;
}
