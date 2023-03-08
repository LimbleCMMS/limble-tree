import type { ComponentObj } from "./legacy-component-obj.interface";

/**
 * An object describing a node of the tree
 * @deprecated
 */
export interface LimbleTreeNode {
   /** A list of nodes to be rendered "under" this one, one level deeper in the tree. */
   nodes?: LimbleTreeData;
   /** An object that describes the component which will represent this node in the visual tree */
   component?: ComponentObj;
   collapsed?: boolean;
   [index: string]: unknown;
}

/**
 * An object that the limble-tree-root component uses to build the tree
 * @deprecated
 */
export type LimbleTreeData = Array<LimbleTreeNode>;
