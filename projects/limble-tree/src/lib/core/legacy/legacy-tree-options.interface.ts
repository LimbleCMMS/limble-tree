import { ComponentObj } from "./legacy-component-obj.interface";
import { LimbleTreeNode } from "./legacy-tree-data.interface";

/**
 * A group of settings for changing the functionality of the tree
 * @deprecated
 */
export interface LimbleTreeOptions {
   /** The component object to use if one is not specified for a particular node */
   defaultComponent?: ComponentObj;
   /** The number of pixels to indent each level of the tree. Defaults to 45 */
   indent?: number;
   /**
    * Whether to allow "nesting" (placing a node one level deeper than currently exists on the branch).
    * When this is a boolean, it applies to all nodes. When this is a function, the node in question
    * is passed in. Defaults to true.
    */
   allowNesting?: boolean | ((nodeData: LimbleTreeNode) => boolean);
   /**
    * Whether to allow a node to be dragged. When this is a boolean, it applies to all nodes. When this
    * is a function, the node in question is passed in. Defaults to true.
    */
   allowDragging?: boolean | ((nodeData: LimbleTreeNode) => boolean);
   /** A callback to determine whether a sourceNode can be dropped at a particular location. */
   allowDrop?: (
      sourceNode: LimbleTreeNode,
      proposedParent: LimbleTreeNode | null,
      proposedIndex: number
   ) => boolean;
   /** When set to true, list mode will enforce a flat tree structure, meaning there
    * can only be one level of the tree. `allowNesting` is automatically set to `false`
    * and any children will be deleted.
    *
    * This mode can be used when the same dynamic drag and drop functionality of
    * the tree is desired, but the tree structure itself is not necessary. This
    * also opens up the pagination API on the limble-tree-root component. See the
    * README for details on pagination.
    */
   listMode?: boolean;
}
