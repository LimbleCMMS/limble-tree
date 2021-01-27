import { Injectable, Type, ViewContainerRef } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ComponentCreatorService } from "../singletons/component-creator.service";
import { DropZoneInfo, DropZoneService } from "../singletons/drop-zone.service";
import { Branch } from "branches";
import { LimbleTreeNodeComponent } from "../limble-tree-node/limble-tree-node.component";
import { arraysAreEqual } from "../util";
import { TempService } from "../singletons/temp.service";

/** An object describing a node of the tree */
export interface LimbleTreeNode {
   /** A list of nodes to be rendered "under" this one, one level deeper in the tree. */
   nodes?: LimbleTreeData;
   // /** A custom data object that will be passed into the component as an `Input()` binding called `nodeData` */
   // data: unknown;
   /** An object that describes the component which will represent this node in the visual tree */
   component?: ComponentObj;
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
   /** Whether to allow "nesting" (placing a node one level deeper than currently exists on the branch)
    * when dragging a node. Defaults to true.
    */
   allowNesting?: boolean;
   /** Whether to allow drag-and-drop functionality. Defaults to true.*/
   allowDragging?: boolean;
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

export const INDENT = 45;

export interface ProcessedOptions {
   defaultComponent?: ComponentObj;
   indent: number;
   allowNesting: boolean;
   allowDragging: boolean;
}

@Injectable()
export class TreeService {
   public changes$: BehaviorSubject<null>;
   private host: ViewContainerRef | undefined;
   public treeData: LimbleTreeData | undefined;
   public treeOptions: ProcessedOptions | undefined;
   public treeModel: Branch<any>;

   constructor(
      private readonly componentCreatorService: ComponentCreatorService,
      private readonly dropZoneService: DropZoneService,
      private readonly tempService: TempService
   ) {
      this.changes$ = new BehaviorSubject(null);
      this.treeModel = new Branch(null);
   }

   public init(
      host: ViewContainerRef,
      data: LimbleTreeData,
      options?: LimbleTreeOptions
   ) {
      this.host = host;
      this.treeData = data;
      this.treeModel = new Branch(null);
      this.treeOptions = this.processOptions(options);
      this.dropZoneService.clearDropZones();
      for (const node of this.treeData) {
         const branch = new Branch(node);
         this.treeModel.appendChild(branch);
      }
      this.render();
   }

   public render() {
      if (this.host === undefined || this.treeModel === undefined) {
         throw new Error("TreeModel not initialized");
      }
      this.host.clear();
      for (const branch of this.treeModel.getChildren()) {
         const componentRef = this.componentCreatorService.appendComponent<LimbleTreeNodeComponent>(
            LimbleTreeNodeComponent,
            this.host
         );
         componentRef.instance.branch = branch;
      }
      this.changes$.next(null);
   }

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
      }
   }

   private processOptions(options: LimbleTreeOptions = {}): ProcessedOptions {
      return {
         defaultComponent: options.defaultComponent,
         indent: options.indent ?? INDENT,
         allowNesting: options.allowNesting ?? true,
         allowDragging: options.allowDragging ?? true
      };
   }

   public move(source: Branch<any>, targetCoordinates: Array<number>) {
      const targetParentCoordinates = [...targetCoordinates];
      const index = targetParentCoordinates.pop();
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
      this.render();
   }

   public isLastDropZoneInBranch(coordinates: Array<number>): boolean {
      const group = this.getCoordinatesGroup(coordinates);
      if (group.length - 1 < coordinates[coordinates.length - 1]) {
         return true;
      }
      return false;
   }

   public isOnRoot(coordinates: Array<number>): boolean {
      return coordinates.length === 1;
   }

   public showDropZoneFamily(
      dropZone: DropZoneInfo,
      active: boolean = true,
      skip: "below" | "above" | false = false
   ) {
      this.dropZoneService.showSingleDropZone(dropZone, active);
      if (
         !this.isOnRoot(dropZone.coordinates) &&
         this.isLastDropZoneInBranch(dropZone.coordinates) &&
         skip !== "below"
      ) {
         const parent = [...dropZone.coordinates];
         parent.pop();
         const secondaryDropZoneCoordinates = this.getNextSibling(parent);
         if (secondaryDropZoneCoordinates === null) {
            throw new Error("Could not get secondary drop zone coordinates");
         }
         const secondaryDropZone = this.dropZoneService
            .getDropZones()
            .find((dropZoneInfo) => {
               return arraysAreEqual(
                  dropZoneInfo.coordinates,
                  secondaryDropZoneCoordinates
               );
            });
         if (secondaryDropZone !== undefined) {
            this.showDropZoneFamily(secondaryDropZone, false, "above");
         }
      }
      if (skip !== "above") {
         const position = dropZone.coordinates[dropZone.coordinates.length - 1];
         if (position === 0) {
            return;
         }
         const previousSibling = [...dropZone.coordinates];
         previousSibling[previousSibling.length - 1]--;
         const hasChildren = this.coordinatesHasChildren(previousSibling);
         if (hasChildren) {
            const previousSiblingFirstChild = [...previousSibling];
            previousSiblingFirstChild.push(0);
            let secondaryDropZoneCoordinates: Array<number> = previousSiblingFirstChild;
            let next = this.getNextSibling(secondaryDropZoneCoordinates);
            while (next !== null) {
               secondaryDropZoneCoordinates = next;
               next = this.getNextSibling(secondaryDropZoneCoordinates);
            }
            const secondaryDropZone = this.dropZoneService
               .getDropZones()
               .find((dropZoneInfo) => {
                  return arraysAreEqual(
                     dropZoneInfo.coordinates,
                     secondaryDropZoneCoordinates
                  );
               });
            if (secondaryDropZone !== undefined) {
               this.showDropZoneFamily(secondaryDropZone, false, "below");
            }
         } else if (
            !arraysAreEqual(
               this.tempService.get()?.getCoordinates() ?? [],
               previousSibling
            )
         ) {
            if (this.treeOptions?.allowNesting !== false) {
               const secondaryDropZoneCoordinates = [...previousSibling];
               secondaryDropZoneCoordinates.push(0);
               const secondaryDropZone = this.dropZoneService
                  .getDropZones()
                  .find((dropZoneInfo) => {
                     return arraysAreEqual(
                        dropZoneInfo.coordinates,
                        secondaryDropZoneCoordinates
                     );
                  });
               if (secondaryDropZone !== undefined) {
                  this.showDropZoneFamily(secondaryDropZone, false, "below");
               }
            }
         }
      }
   }

   public coordinatesHasChildren(coordinates: Array<number>): boolean {
      const children = this.getCoordinatesChildren(coordinates);
      return children !== undefined && children.length > 0;
   }

   public swapActiveDropZone(dropZoneInfo: DropZoneInfo) {
      if (this.dropZoneService.getActiveDropZoneInfo() === null) {
         throw new Error("could not get active drop zone");
      }
      const secondaryDropZones = this.dropZoneService.getSecondaryDropZones();
      const index = secondaryDropZones.findIndex((dropZone) => {
         return dropZone.coordinates === dropZoneInfo.coordinates;
      });
      if (index === -1) {
         throw new Error("failed to swap active drop zone");
      }
      this.showDropZoneFamily(dropZoneInfo);
   }

   private getNextSibling(coordinates: Array<number>): Array<number> | null {
      const temp = [...coordinates];
      const group = this.getCoordinatesGroup(temp);
      const nextPosition = temp[temp.length - 1]++;
      if (group.length <= nextPosition) {
         return null;
      }
      return temp;
   }

   private getCoordinatesGroup(
      coordinates: Array<number>
   ): Array<LimbleTreeNode> {
      if (this.treeData === undefined) {
         throw new Error("treeData is not defined");
      }
      let group = this.treeData;
      let allowSingleUndefined = true;
      for (const [index, key] of coordinates.entries()) {
         if (index === coordinates.length - 1) {
            break;
         }
         let newGroup = group[key].nodes;
         if (newGroup === undefined) {
            if (allowSingleUndefined === true) {
               //This allows us to create an "inner" group on the fly -- but only once during this function
               group[key].nodes = [];
               newGroup = group[key].nodes as Array<LimbleTreeNode>;
               allowSingleUndefined = false;
            } else {
               throw new Error("bad coordinates");
            }
         }
         group = newGroup;
      }
      return group;
   }

   private getCoordinatesChildren(
      coordinates: Array<number>
   ): Array<LimbleTreeNode> | undefined {
      if (this.treeData === undefined) {
         throw new Error("treeData is not defined");
      }
      let cursor = this.treeData;
      for (const key of coordinates) {
         const newCursor = cursor[key].nodes;
         if (newCursor === undefined) {
            return undefined;
         }
         cursor = newCursor;
      }
      return cursor;
   }

   private rebuildTreeData(): void {
      const temp: LimbleTreeData = [];
      for (const branch of this.treeModel.getChildren()) {
         temp.push(this.rebuildBranch(branch));
      }
      this.treeData = temp;
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
