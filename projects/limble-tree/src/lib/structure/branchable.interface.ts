export interface Branchable<Child> {
   branches: () => Array<Child>;
   getBranch: (index: number) => Child | undefined;
}
