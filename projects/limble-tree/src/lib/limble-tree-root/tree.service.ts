import { Injectable, Type, ViewContainerRef } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { ComponentCreatorService } from "../singletons/component-creator.service";
import { DropZoneService } from "./drop-zone.service";
import { Branch, BranchCoordinates } from "../Branch";
import { LimbleTreeNodeComponent } from "../limble-tree-node/limble-tree-node.component";
import { LimbleTreePlaceholderComponent } from "../limble-tree-placeholder/limble-tree-placeholder.component";

/** An object describing a node of the tree */
export interface LimbleTreeNode {
   /** A list of nodes to be rendered "under" this one, one level deeper in the tree. */
   nodes?: LimbleTreeData;
   // /** A custom data object that will be passed into the component as an `Input()` binding called `nodeData` */
   // data: unknown;
   /** An object that describes the component which will represent this node in the visual tree */
   component?: ComponentObj;
   collapsed?: boolean;
   [index: string]: unknown;
}

/** An object that the limble-tree-root component uses to build the tree */
export type LimbleTreeData = Array<LimbleTreeNode>;

/** A group of settings for changing the functionality of the tree */
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

/** An object that references the component to be rendered and its bindings */
export interface ComponentObj {
   /** The component class */
   class: Type<unknown>;
   /** The bindings (inputs and outputs) of the class */
   bindings?: {
      [index: string]: unknown;
   };
}

/** The default value for the `indent` option */
export const INDENT = 45;

/** An options object with default values loaded where applicable */
export interface ProcessedOptionsBase extends LimbleTreeOptions {
   defaultComponent?: ComponentObj;
   indent: number;
   allowNesting: boolean | ((nodeData: LimbleTreeNode) => boolean);
   allowDragging: boolean | ((nodeData: LimbleTreeNode) => boolean);
   allowDrop: (
      sourceNode: LimbleTreeNode,
      proposedParent: LimbleTreeNode | null,
      proposedIndex: number
   ) => boolean;
   listMode: boolean;
   itemsPerPage: number | undefined;
   page: number | undefined;
}

export interface ProcessedOptionsWithPagination extends ProcessedOptionsBase {
   listMode: true;
   itemsPerPage: number;
   page: number;
}

export interface ProcessedOptionsWithoutPagination
   extends ProcessedOptionsBase {
   listMode: false;
   itemsPerPage: undefined;
   page: undefined;
}

export type ProcessedOptions =
   | ProcessedOptionsWithPagination
   | ProcessedOptionsWithoutPagination;

/** the value emitted from the root component after a node is dropped */
export interface TreeDrop {
   /** The node that was dropped */
   target: LimbleTreeNode;
   /** the target's parent before the drag and drop, or null if it was a top-level node */
   oldParent: LimbleTreeNode | null;
   /** the index of the node before the drag and drop relative to its old siblings */
   oldIndex: number;
   /** the target's parent after the drag and drop, or null if it is now a top-level node */
   newParent: LimbleTreeNode | null;
   /** the index of the node after the drag and drop relative to its new siblings */
   newIndex: number;
}

@Injectable()
export class TreeService {
   public changes$: ReplaySubject<null>;
   public drops$: ReplaySubject<TreeDrop>;
   private host: ViewContainerRef | undefined;
   public treeData: LimbleTreeData | undefined;
   private uncutData: LimbleTreeData | undefined;
   public treeOptions: ProcessedOptions | undefined;
   public treeModel: Branch<any>;
   private placeholder: boolean;

   constructor(
      private readonly componentCreatorService: ComponentCreatorService,
      private readonly dropZoneService: DropZoneService
   ) {
      this.changes$ = new ReplaySubject(1);
      this.drops$ = new ReplaySubject(1);
      this.treeModel = new Branch(null);
      this.placeholder = false;
   }

   /** Initializes the service and renders the tree.
    * @param host - The ViewContainerRef into which the tree will be rendered.
    * @param data - The data array that was passed in to LimbleTreeRoot, which is
    * the users' representation of the tree
    * @param options - The options object that was passed in to LimbleTreeRoot
    */
   public init(
      host: ViewContainerRef,
      data: LimbleTreeData,
      options?: LimbleTreeOptions,
      itemsPerPage?: number,
      page?: number
   ): void {
      this.host = host;
      this.uncutData = data;
      this.treeOptions = this.processOptions(options, itemsPerPage, page);
      if (this.treeOptions.listMode === true) {
         let start =
            this.treeOptions.itemsPerPage * (this.treeOptions.page - 1);
         if (isNaN(start)) {
            //This catches the case where itemsPerPage was not passed by the user,
            //causing `start` to equal infinity*0, which is NaN.
            start = 0;
         }
         const end = start + this.treeOptions.itemsPerPage;
         this.treeData = this.uncutData.slice(start, end);
      } else {
         this.treeData = this.uncutData;
      }
      this.render();
   }

   public usePlaceholder() {
      if (this.placeholder === true) {
         return;
      }
      if (this.host === undefined) {
         throw new Error("TreeModel not initialized");
      }
      this.placeholder = true;
      const placeholderNode: LimbleTreeNode = {
         component: { class: LimbleTreePlaceholderComponent }
      };
      const branch = new Branch(placeholderNode);
      this.treeModel.appendChild(branch);
      const componentRef = this.componentCreatorService.appendComponent<LimbleTreeNodeComponent>(
         LimbleTreeNodeComponent,
         this.host
      );
      componentRef.instance.branch = branch;
   }

   public removePlaceholder() {
      if (this.placeholder === false) {
         return;
      }
      const placeholderIndex = this.treeModel.getChildren().length - 1;
      if (placeholderIndex !== -1) {
         this.treeModel.removeChild(placeholderIndex); //remove the placeholder
      }
      this.placeholder = false;
   }

   /** Renders the entire tree from root to leaves */
   private render() {
      if (
         this.host === undefined ||
         this.treeData === undefined ||
         this.treeOptions === undefined
      ) {
         throw new Error("TreeModel not initialized");
      }
      this.host.clear();
      this.dropZoneService.restart();
      //We don't need to call removePlaceholder here because we already cleared it away in the preceding lines. We just have to tell the service that it is done.
      this.placeholder = false;
      this.treeModel = new Branch(null);
      if (this.treeData.length === 0) {
         //Tree is empty, but we have to to have something there so other trees' items can be dropped into it
         this.usePlaceholder();
      } else {
         for (const node of this.treeData) {
            const branch = new Branch(node);
            this.treeModel.appendChild(branch);
         }
         for (const branch of this.treeModel.getChildren()) {
            const componentRef = this.componentCreatorService.appendComponent<LimbleTreeNodeComponent>(
               LimbleTreeNodeComponent,
               this.host
            );
            componentRef.instance.branch = branch;
            //The LimbleTreeNodeComponent will (indirectly) call the `renderBranch` method of this service to render
            //its own children
         }
      }
      setTimeout(() => {
         if (this.treeOptions === undefined) {
            throw new Error("TreeModel not initialized");
         }
         this.dropZoneService.init(this.treeModel, this.treeOptions);
         this.changes$.next(null);
      });
   }

   /** Renders a branch of the tree and all of its descendants */
   public renderBranch(host: ViewContainerRef, branch: Branch<any>) {
      if (this.treeModel === undefined) {
         throw new Error("TreeModel not initialized");
      }
      host.clear();
      for (const node of branch.data.nodes ?? []) {
         const newBranch = new Branch(node);
         branch.appendChild(newBranch);
         const componentRef = this.componentCreatorService.appendComponent<LimbleTreeNodeComponent>(
            LimbleTreeNodeComponent,
            host
         );
         componentRef.instance.branch = newBranch;
         //The LimbleTreeNodeComponent will (indirectly) call the `renderBranch` method of this service to render
         //its own children
      }
   }

   private processOptions(
      options: LimbleTreeOptions = {},
      itemsPerPage: number = Infinity,
      page: number = 1
   ): ProcessedOptions {
      if (
         options.listMode === true &&
         options.allowNesting !== undefined &&
         options.allowNesting !== false
      ) {
         console.warn(
            "The value of `allowNesting` will be ignored; it must be false when `listMode` is true"
         );
      }
      const result: ProcessedOptionsBase = {
         defaultComponent: options.defaultComponent,
         indent: options.indent ?? INDENT,
         allowNesting:
            options.listMode !== true && (options.allowNesting ?? true),
         allowDragging: options.allowDragging ?? true,
         allowDrop: options.allowDrop ?? (() => true),
         listMode: options.listMode ?? false,
         itemsPerPage: options.listMode ? itemsPerPage : undefined,
         page: options.listMode ? page : undefined
      };
      return result as ProcessedOptions;
   }

   public drop(source: Branch<any>, targetCoordinates: BranchCoordinates) {
      const sourceParent = source.getParent();
      const sourceIndex = source.getIndex();
      if (sourceIndex === undefined) {
         throw new Error("Cannot move the hidden root node");
      }
      let targetParentCoordinates: BranchCoordinates;
      let index: number | undefined;
      if (this.placeholder === true) {
         targetParentCoordinates = [];
         index = 0;
         this.removePlaceholder();
      } else {
         targetParentCoordinates = [...targetCoordinates];
         index = targetParentCoordinates.pop();
      }
      if (index === undefined) {
         throw new Error("target coordinates are empty");
      }
      const targetParent = this.treeModel.getDescendant(
         targetParentCoordinates
      );
      if (targetParent === undefined) {
         throw new Error("could not get to target");
      }
      targetParent.insertChild(source, index);
      this.rebuildTreeData();
      this.drops$.next({
         target: source.data,
         oldParent: sourceParent?.data as LimbleTreeNode,
         oldIndex: sourceIndex,
         newParent: targetParent.data,
         newIndex: index
      });
      this.render();
   }

   public remove(target: Branch<any>) {
      target.remove();
      this.removePlaceholder();
      this.rebuildTreeData();
      this.render();
   }

   private rebuildTreeData(): void {
      if (
         this.uncutData === undefined ||
         this.treeData === undefined ||
         this.treeOptions === undefined
      ) {
         throw new Error("Tree data not initialized");
      }
      this.treeData.length = 0;
      for (const branch of this.treeModel.getChildren()) {
         this.treeData.push(this.rebuildBranch(branch));
      }
      if (this.treeOptions.listMode === true) {
         let start =
            this.treeOptions.itemsPerPage * (this.treeOptions.page - 1);
         if (isNaN(start)) {
            //This catches the case where itemsPerPage was not passed by the user,
            //causing `start` to equal infinity*0, which is NaN.
            start = 0;
         }
         const end = start + this.treeOptions.itemsPerPage;
         this.uncutData.splice(
            start,
            this.treeOptions.itemsPerPage,
            ...this.treeData
         );
         this.treeData = this.uncutData.slice(start, end);
      } else {
         this.uncutData = this.treeData;
      }
   }

   private rebuildBranch(branch: Branch<any>): LimbleTreeNode {
      const temp: LimbleTreeNode = branch.data;
      temp.nodes = [];
      for (const child of branch.getChildren()) {
         temp.nodes.push(this.rebuildBranch(child));
      }
      return temp;
   }

   public getPlaceholder() {
      return this.placeholder;
   }
}
