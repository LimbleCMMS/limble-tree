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
): boolean {
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
): boolean {
   return (
      options !== undefined &&
      (options.allowDragging === true ||
         (typeof options.allowDragging === "function" &&
            nodeData !== undefined &&
            options.allowDragging(nodeData) === true))
   );
}

export function isFirefox(): boolean {
   return navigator.userAgent.includes("Firefox");
}

/** Because drop zones can disappear when the mouse moves, sometimes
 * moving the mouse just a little bit inside the tree causes the tree to
 * shrink such that the mouse is no longer over the tree. In this case,
 * a dragleave event may not fire, and we can't clear the drop zones. This
 * function is used to catch this edge case.
 */
export function suddenTreeExit(event: DragEvent): boolean {
   if (event.target === null || !(event.target instanceof Element)) {
      throw new Error("failed to get event target element");
   }
   const treeEventHost = event.target.closest(".tree-event-host");
   if (treeEventHost === null) {
      console.log(event.target);
      throw new Error("failed to find treeEventHost");
   }
   const rect = treeEventHost.getBoundingClientRect();
   const clientY = event.clientY;
   if (clientY > rect.bottom || clientY < rect.top) {
      return true;
   }
   return false;
}
