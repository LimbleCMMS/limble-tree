import { Type, ViewContainerRef } from "@angular/core";
import { TreeRoot, TreeBranch, TreeOptions, config } from "../core";
import { LimbleTreeOptions as LegacyLimbleTreeOptions } from "./legacy-tree-options.interface";
import { LimbleTreeData, LimbleTreeNode } from "./legacy-tree-data.interface";
import { TreeError } from "../errors";
import { treeCollapser } from "../extras/collapse/collapse";

/**
 * A shim to help with the transition from v0 to v1.
 * @deprecated
 */
export class LegacyTree {
   /**
    * Creates a v1 tree structure from a v0 data array and v0 tree options.
    * Note: the `listMode` and `collapsible` options will be ignored.
    */
   public createTreeFromLegacyArray<Component>(
      container: ViewContainerRef,
      data: LimbleTreeData,
      treeOptions: LegacyLimbleTreeOptions = {}
   ): TreeRoot<Component> {
      const root = new TreeRoot<Component>(container);
      config.setConfig(root, this.upgradeOptions(treeOptions));
      for (const node of data) {
         this.renderTreeNode(root, node, treeOptions);
      }
      return root;
   }

   public upgradeOptions(legacyOptions: LegacyLimbleTreeOptions): TreeOptions {
      return {
         indentation: legacyOptions.indent,
         allowNesting: (branch): boolean => {
            if (legacyOptions.allowNesting === undefined) {
               return true;
            }
            if (typeof legacyOptions.allowNesting === "boolean") {
               return legacyOptions.allowNesting;
            }
            return legacyOptions.allowNesting(branch as any);
         },
         allowDragging: (branch): boolean => {
            if (legacyOptions.allowDragging === undefined) {
               return true;
            }
            if (typeof legacyOptions.allowDragging === "boolean") {
               return legacyOptions.allowDragging;
            }
            return legacyOptions.allowDragging(branch as any);
         },
         allowDrop: (source, parent, index): boolean => {
            if (legacyOptions.allowDrop === undefined) {
               return true;
            }
            return legacyOptions.allowDrop(source as any, parent as any, index);
         }
      };
   }

   private renderTreeNode<T>(
      parent: TreeRoot<T> | TreeBranch<T>,
      node: LimbleTreeNode,
      options: LegacyLimbleTreeOptions
   ): void {
      const component =
         node.component?.class ?? options.defaultComponent?.class;
      if (component === undefined) {
         throw new TreeError("A component must be provided");
      }
      const bindings = (node.component?.bindings ??
         options.defaultComponent?.bindings ??
         {}) as { [K in keyof T]?: T[K] | undefined };
      const nodeData = { ...node };
      delete nodeData.nodes;
      delete nodeData.collapsed;
      delete nodeData.component;
      const branch = parent.grow(component as Type<T>, {
         inputBindings: bindings,
         meta: { nodeData }
      });
      for (const childNode of node.nodes ?? []) {
         this.renderTreeNode(branch, childNode, options);
      }
      if (node.collapsed === true) {
         treeCollapser.collapse(branch);
      }
   }
}
