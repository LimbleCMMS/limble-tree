import { Injectable, Type, ViewContainerRef } from "@angular/core";
import { ComponentCreatorService } from "../singletons/component-creator.service";
import { DropZoneService } from "./drop-zone.service";
import { Branch, BranchCoordinates } from "../classes/Branch";
import { LimbleTreeNodeComponent } from "../limble-tree-node/limble-tree-node.component";
import { DragStateService } from "../singletons/drag-state.service";
import { BehaviorSubject, Subject } from "rxjs";
import { arraysAreEqual } from "../util";
import { debounceTime, tap } from "rxjs/operators";

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
   public readonly changes$: Subject<null>;
   public readonly drops$: Subject<TreeDrop>;
   public host: ViewContainerRef | undefined;
   public treeData: LimbleTreeData | undefined;
   /** This should never be reassigned. It is assigned in init() and no where else. We need to keep the reference from breaking. */
   private originalData: LimbleTreeData | undefined;
   public treeOptions: ProcessedOptions | undefined;
   public treeModel: Branch<any>;
   private placeholder: boolean;
   public captured: boolean;
   public readonly cleanupSignal$: Subject<boolean>;
   private synchronizer: boolean;
   public placeholder$: BehaviorSubject<boolean>;

   constructor(
      private readonly componentCreatorService: ComponentCreatorService,
      private readonly dropZoneService: DropZoneService,
      private readonly dragStateService: DragStateService
   ) {
      this.changes$ = new Subject();
      this.drops$ = new Subject();
      this.treeModel = new Branch(null);
      this.placeholder = false;
      this.captured = false;
      this.cleanupSignal$ = new Subject();
      let rebuild = false;
      this.cleanupSignal$
         .pipe(
            tap((value) => {
               rebuild = value;
            }),
            debounceTime(5)
         )
         .subscribe(() => {
            this.cleanup(rebuild);
            rebuild = false;
         });
      this.synchronizer = false;
      this.placeholder$ = new BehaviorSubject<boolean>(false);
      this.placeholder$.subscribe((value) => {
         this.placeholder = value;
      });
   }

   public drop(source: Branch<any>, targetCoordinates: BranchCoordinates) {
      //prep
      const sourceParent = source.getParent();
      if (sourceParent === null) {
         throw new Error("can't drop root of tree");
      }
      const sourceIndex = source.getIndex();
      if (sourceIndex === undefined || sourceIndex === null) {
         throw new Error("Cannot move the hidden root node");
      }
      let targetParentCoordinates: BranchCoordinates;
      let newIndex: number | undefined;
      if (this.placeholder === true) {
         targetParentCoordinates = [];
         newIndex = 0;
      } else {
         targetParentCoordinates = [...targetCoordinates];
         newIndex = targetParentCoordinates.pop();
      }
      if (newIndex === undefined) {
         throw new Error("target coordinates are empty");
      }
      const targetParent = this.treeModel.getDescendant(
         targetParentCoordinates
      );
      if (targetParent === undefined) {
         throw new Error("could not get to target");
      }
      const target = this.dropZoneService.getDropZone(targetCoordinates);
      const targetIndex = target?.getLocation().insertIndex;
      const targetHost = target?.getHost();
      const sourceHost = this.dragStateService.getData()?.parentContainer;
      if (this.placeholder === true) {
         this.placeholder$.next(false);
      }
      //Change the treeModel
      targetParent.insertChild(source, newIndex);
      //Prepare to update the view
      if (
         targetHost === undefined ||
         sourceHost === undefined ||
         targetIndex === undefined
      ) {
         //Hitting this means there is a bug, but not a fatal one.
         //Just render the whole tree again.
         console.warn(
            "Could not perform a precise update. Re-rendering the entire tree instead"
         );
         this.render();
         this.changes$.next(null);
         return;
      }
      //Update the view
      const nodesInSource = sourceHost.length;
      const componentRef = this.componentCreatorService.appendComponent(
         LimbleTreeNodeComponent,
         targetHost,
         newIndex
      );
      componentRef.instance.branch = source;
      componentRef.instance.parentHost = targetHost;
      if (
         targetIndex < sourceIndex &&
         sourceHost.length > nodesInSource &&
         arraysAreEqual(sourceParent.getCoordinates(), targetParentCoordinates)
      ) {
         sourceHost.remove(sourceIndex + 1);
      } else {
         sourceHost.remove(sourceIndex);
      }
      //Update the tree data
      this.rebuildTreeData();
      //Publish drop data
      this.drops$.next({
         target: source.data,
         oldParent: sourceParent.data as LimbleTreeNode,
         oldIndex: sourceIndex,
         newParent: targetParent.data,
         newIndex: newIndex
      });
      this.cleanupSignal$.next(false);
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
      this.originalData = data;
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
         this.treeData = this.originalData.slice(start, end);
      } else {
         this.treeData = [...this.originalData];
      }
      this.synchronizer = false;
      this.render();
   }

   private cleanup(rebuild = false): void {
      if (rebuild) {
         this.rebuildTreeData();
      }
      if (this.treeData?.length === 0) {
         //We do a full render here because it isn't actually any slower
         //when there are no nodes, and it saves us from having to handle
         //some race conditions with the placeholder component
         this.render();
      } else {
         this.changes$.next(null);
         this.dropZoneService.update();
      }
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
      this.placeholder$.next(false);
      this.treeModel = new Branch(null);
      if (this.treeData.length === 0) {
         //Tree is empty, but we have to to have something there so other trees' items can be dropped into it
         this.placeholder$.next(true);
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
            componentRef.instance.parentHost = this.host;
            //The LimbleTreeNodeComponent will (indirectly) call the `renderBranch` method of this service to render
            //its own children
         }
      }
      this.synchronizer = true;
      setTimeout(() => {
         if (this.treeOptions === undefined) {
            throw new Error("TreeModel not initialized");
         }
         this.changes$.next(null);
         if (this.synchronizer === false) {
            //The tree service has been reinitialized since this timeout was called.
            //The new tree data will just overwrite the drop zone data anyway, so
            //we can skip the drop zone initialization on this round for efficiency
            //and also to avoid some possible (?) race conditions
            return;
         }
         this.synchronizer = false;
         this.dropZoneService.init(this.treeModel, this.treeOptions);
      });
   }

   /** Renders a branch of the tree and all of its descendants */
   public renderBranch(host: ViewContainerRef, branch: Branch<any>) {
      if (this.treeModel === undefined) {
         throw new Error("TreeModel not initialized");
      }
      host.clear();
      branch.clearChildren();
      for (const node of branch.data?.nodes ?? []) {
         const newBranch = new Branch(node);
         branch.appendChild(newBranch);
         const componentRef = this.componentCreatorService.appendComponent<LimbleTreeNodeComponent>(
            LimbleTreeNodeComponent,
            host
         );
         componentRef.instance.branch = newBranch;
         componentRef.instance.parentHost = host;
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

   private rebuildTreeData(): void {
      if (
         this.originalData === undefined ||
         this.treeData === undefined ||
         this.treeOptions === undefined ||
         this.host === undefined
      ) {
         throw new Error("Tree data not initialized");
      }
      this.treeData = [];
      for (const branch of this.treeModel.getChildren()) {
         this.treeData.push(this.rebuildBranch(branch));
      }
      if (
         this.treeOptions.listMode === true &&
         this.treeOptions.itemsPerPage < Infinity
      ) {
         const itemsPerPage = this.treeOptions.itemsPerPage;
         const start = itemsPerPage * (this.treeOptions.page - 1);
         this.originalData.splice(start, itemsPerPage, ...this.treeData);
         if (this.treeData.length !== itemsPerPage) {
            let action = false;
            if (
               this.treeData.length < itemsPerPage &&
               start + itemsPerPage <= this.originalData.length
            ) {
               //The current page does not have enough nodes. Add some to the view from the next page.
               const count = itemsPerPage - this.treeData.length;
               for (
                  let index = itemsPerPage - 1;
                  index < itemsPerPage + count - 1;
                  index++
               ) {
                  const branch = new Branch(this.originalData[start + index]);
                  this.treeModel.appendChild(branch);
                  const componentRef = this.componentCreatorService.appendComponent<LimbleTreeNodeComponent>(
                     LimbleTreeNodeComponent,
                     this.host
                  );
                  componentRef.instance.branch = branch;
                  componentRef.instance.parentHost = this.host;
               }
               action = true;
            } else if (this.treeData.length > itemsPerPage) {
               //The current page has too many nodes. Remove some of them from the view.
               const count = this.treeData.length - itemsPerPage;
               for (
                  let index = itemsPerPage + count - 1;
                  index >= itemsPerPage;
                  index--
               ) {
                  this.treeModel.removeChild(index);
                  this.host.remove(index);
               }
               action = true;
            }
            if (action === true) {
               const end = start + itemsPerPage;
               this.treeData = this.originalData.slice(start, end);
            }
         }
      } else {
         this.originalData.length = 0;
         this.originalData.push(...this.treeData);
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
}
