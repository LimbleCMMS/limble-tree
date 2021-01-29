import type {
   LimbleTreeNode,
   ProcessedOptions
} from "./limble-tree-root/tree.service";

export function arraysAreEqual(
   array1: Array<unknown>,
   array2: Array<unknown>
): boolean {
   if (array1.length !== array2.length) {
      return false;
   }
   for (const [index, value1] of array1.entries()) {
      const value2 = array2[index];
      if (value1 instanceof Array && value2 instanceof Array) {
         if (!arraysAreEqual(value1, value2)) {
            return false;
         }
      } else if (value1 !== value2) {
         return false;
      }
   }
   return true;
}

export function isElementDescendant(
   potentialAncestor: Node,
   potentialDescendant: Node
): boolean | undefined {
   if (potentialAncestor === potentialDescendant) {
      return true;
   }
   let cursor = potentialDescendant.parentNode;
   while (cursor !== document) {
      if (cursor === null) {
         //Did not reach `document` or ancestor. potentialDescendant is not part of the DOM.
         return undefined;
      }
      if (cursor === potentialAncestor) {
         return true;
      }
      cursor = cursor.parentNode;
   }
   return false;
}

export function isNestingAllowed(
   options?: ProcessedOptions,
   nodeData?: LimbleTreeNode
) {
   return (
      options !== undefined &&
      (options.allowNesting === true ||
         (typeof options.allowNesting === "function" &&
            nodeData !== undefined &&
            options.allowNesting(nodeData) === true))
   );
}

export function isDraggingAllowed(
   options?: ProcessedOptions,
   nodeData?: LimbleTreeNode
) {
   return (
      options !== undefined &&
      (options.allowDragging === true ||
         (typeof options.allowDragging === "function" &&
            nodeData !== undefined &&
            options.allowDragging(nodeData) === true))
   );
}
