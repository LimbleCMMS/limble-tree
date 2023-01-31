import { Injectable } from "@angular/core";
import { TreeBranch } from "../../core";

@Injectable()
export class TreeCollapseService {
   private readonly tempStorage: Map<TreeBranch<any>, Array<TreeBranch<any>>>;

   public constructor() {
      this.tempStorage = new Map();
   }

   public collapse<T>(treeBranch: TreeBranch<T>): void {
      if (treeBranch.branches().length === 0) {
         console.warn("`collapse` called, but the branch has no nodes to hide");
         return;
      }
      const branches: Array<TreeBranch<T>> = [];
      this.tempStorage.set(treeBranch, branches);
      treeBranch.branches().forEach((branch) => {
         branch.prune();
         branches.push(branch);
      });
   }

   public expand<T>(treeBranch: TreeBranch<T>): void {
      const branches = this.tempStorage.get(treeBranch);
      if (branches === undefined) {
         console.warn(
            "`expand` called, but no nodes are stored for the treeBranch"
         );
         return;
      }
      branches.forEach((branch) => {
         branch.graftTo(treeBranch);
      });
      this.tempStorage.delete(treeBranch);
   }

   public isCollapsed<T>(treeBranch: TreeBranch<T>): boolean {
      return this.tempStorage.has(treeBranch);
   }
}
