import { TreeBranch } from "../../core";

class TreeCollapser {
   private readonly tempStorage: Map<TreeBranch<any>, Array<TreeBranch<any>>>;

   public constructor() {
      this.tempStorage = new Map();
   }

   public collapse<T>(treeBranch: TreeBranch<T>): void {
      if (treeBranch.branches().length === 0) return;
      const branches: Array<TreeBranch<T>> = [];
      this.tempStorage.set(treeBranch, branches);
      treeBranch.branches().forEach((branch) => {
         branch.prune();
         branches.push(branch);
      });
   }

   public expand<T>(treeBranch: TreeBranch<T>): void {
      const branches = this.tempStorage.get(treeBranch);
      if (branches === undefined) return;
      branches.forEach((branch) => {
         branch.graftTo(treeBranch);
      });
      this.tempStorage.delete(treeBranch);
      treeBranch.detectChanges();
   }

   public isCollapsed<T>(treeBranch: TreeBranch<T>): boolean {
      return this.tempStorage.has(treeBranch);
   }

   public storePrecollapsedNode<T>(
      parent: TreeBranch<T>,
      branch: TreeBranch<T>
   ): void {
      this.tempStorage.set(
         parent,
         (this.tempStorage.get(parent) ?? []).concat(branch)
      );
   }
}

export const treeCollapser = new TreeCollapser();
