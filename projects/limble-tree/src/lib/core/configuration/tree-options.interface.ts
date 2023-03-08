import type { TreeBranch } from "../tree-branch/tree-branch";
import type { TreeRoot } from "../tree-root/tree-root";

/** The configuration options for a tree, as identified by a TreeRoot */
export interface TreeOptions {
   dragAndDrop?: {
      /**
       * A function to indicate whether to allow a node to be dragged. The node in
       * question is passed in. Defaults to a function that always returns true. This
       * function runs when a drag begins, but before the branch is pruned from the tree.
       */
      allowDragging?: <T>(treeBranch: TreeBranch<T>) => boolean;

      /**
       * A function to determine whether a sourceNode can be dropped at a particular location.
       * The sourceNode, the new proposedParent for the sourceNode, and the new proposedIndex
       * for the source node are passed in. This function runs just before displaying a
       * family of dropzones.
       */
      allowDrop?: <T>(
         sourceNode: TreeBranch<T>,
         proposedParent: TreeBranch<T> | TreeRoot<T>,
         proposedIndex: number
      ) => boolean;

      /**
       * A function to indicate whether to allow "nesting" (placing a branch one level
       * deeper than its parent). The node in question is passed in. Defaults to a function
       * that always returns true. This function runs just before displaying a family of
       * dropzones.
       */
      allowNesting?: <T>(treeBranch: TreeBranch<T>) => boolean;
   };

   /**
    * The number of pixels each level of the tree will be indented relative to
    * its parent. Defaults to 16.
    */
   indentation?: number;
}
