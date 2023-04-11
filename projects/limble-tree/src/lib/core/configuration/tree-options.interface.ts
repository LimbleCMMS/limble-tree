import type { TreeBranch } from "../tree-branch";
import type { TreeRoot } from "../tree-root";

/** The configuration options for a tree, as identified by a TreeRoot */
export interface TreeOptions {
   dragAndDrop?: {
      /**
       * A function that determines whether to allow a node to be dragged.
       *
       * @remarks
       * Runs when a drag begins, but before the branch is pruned from the tree.
       *
       * @param treeBranch - The node of the tree that is about to be dragged.
       *
       * @defaultValue A function that always returns true.
       *
       * @returns `true` if the node can be dragged; `false` if it cannot.
       */
      allowDragging?: <T>(treeBranch: TreeBranch<T>) => boolean;

      /**
       * A function to determine whether a sourceNode can be dropped at a
       * particular location.
       *
       * @remarks
       * This function runs just before displaying a family of dropzones.
       *
       * @param sourceBranch - The branch that is being dragged.
       * @param proposedParent - The proposed new parent of the sourceBranch.
       * @param proposedIndex - The proposed new index of the sourceBranch.
       *
       * @defaultValue A function that always returns true.
       */
      allowDrop?: <T>(
         sourceBranch: TreeBranch<T>,
         proposedParent: TreeBranch<T> | TreeRoot<T>,
         proposedIndex: number
      ) => boolean;

      /**
       * A function to indicate whether to allow "nesting" (placing a branch as
       * a child) of a particular branch.
       *
       * @remarks
       * This function runs just before displaying a family of dropzones.
       *
       * @param treeBranch - The node of the tree whose nesting capability is being
       * checked.
       *
       * @defaultValue A function that always returns true.
       */
      allowNesting?: <T>(treeBranch: TreeBranch<T>) => boolean;
   };

   /**
    * The number of pixels each level of the tree will be indented relative to
    * its parent.
    *
    * @defaultValue 16
    */
   indentation?: number;
}
