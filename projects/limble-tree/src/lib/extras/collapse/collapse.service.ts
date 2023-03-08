import { Injectable } from "@angular/core";
import { TreeBranch } from "../../core";
import { treeCollapser } from "./collapse";

/** A service that collapses and expands tree branches */
@Injectable()
export class TreeCollapseService {
   /**
    * Causes a TreeBranch to collapse, temporarily pruning all of its children
    * from the tree.
    */
   public collapse<T>(treeBranch: TreeBranch<T>): void {
      treeCollapser.collapse(treeBranch);
   }

   /**
    * Causes a TreeBranch to expand, restoring all of its children which were
    * previously pruned by a call to `collapse()`.
    */
   public expand<T>(treeBranch: TreeBranch<T>): void {
      treeCollapser.expand(treeBranch);
   }

   /**
    * Determines whether a TreeBranch currently has any children which are
    * pruned from the tree due to a call to  the `collapse()` method.
    *
    * Child branches which are pruned manually from the tree, rather than
    * through the `collapse()` method, will not be considered.
    */
   public isCollapsed<T>(treeBranch: TreeBranch<T>): boolean {
      return treeCollapser.isCollapsed(treeBranch);
   }
}
