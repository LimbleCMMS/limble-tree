import { TreeBranch } from "../tree-branch/tree-branch";
import { TreeRoot } from "../tree-root/tree-root";

export interface TreeOptions {
   /**
    * A function to indicate whether to allow a node to be dragged. The node in
    * question is passed in. Defaults to a function that always returns true. This
    * function runs when DragAndDropService.dragStart runs, and before the branch
    * is pruned from the tree.
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

   /**
    * The number of pixels each level of the tree will be indented relative to
    * its parent. Defaults to 16.
    */
   indentation?: number;

   /**
    * Whether all branches should start out in a collapsed state, so that only one
    * level of the tree is visible at first. Defaults to false.
    */
   startAllCollapsed?: boolean;
}
