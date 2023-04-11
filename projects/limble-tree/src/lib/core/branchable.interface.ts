import type { Type } from "@angular/core";
import type { TreeBranch } from "./tree-branch";
import type { BranchOptions } from "./branch-options.interface";

export interface Branchable<UserlandComponent> {
   branches: () => Array<TreeBranch<UserlandComponent>>;
   getBranch: (index: number) => TreeBranch<UserlandComponent> | undefined;
   grow: (
      component: Type<UserlandComponent>,
      options?: BranchOptions<UserlandComponent>
   ) => TreeBranch<UserlandComponent>;
}
