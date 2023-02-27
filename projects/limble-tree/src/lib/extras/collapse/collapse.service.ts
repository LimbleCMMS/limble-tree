import { Injectable } from "@angular/core";
import { TreeBranch } from "../../core";
import { treeCollapser } from "./collapse";

@Injectable()
export class TreeCollapseService {
   public collapse<T>(treeBranch: TreeBranch<T>): void {
      treeCollapser.collapse(treeBranch);
   }

   public expand<T>(treeBranch: TreeBranch<T>): void {
      treeCollapser.expand(treeBranch);
   }

   public isCollapsed<T>(treeBranch: TreeBranch<T>): boolean {
      return treeCollapser.isCollapsed(treeBranch);
   }
}
