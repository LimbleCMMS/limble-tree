import { Injectable, ViewContainerRef } from "@angular/core";
import { ComponentCreatorService } from "../singletons/component-creator.service";
import { DropZoneComponent } from "../drop-zone/drop-zone.component";
import { arraysAreEqual, isNestingAllowed } from "../util";
import type {
   LimbleTreeData,
   LimbleTreeNode,
   ProcessedOptions
} from "./tree.service";
import { DragStateService } from "../singletons/drag-state.service";
import type { BranchCoordinates } from "../branch";

export interface DropZoneInfo {
   container: ViewContainerRef;
   coordinates: BranchCoordinates;
}

@Injectable()
export class DropZoneService {
   private activeDropZoneInfo: DropZoneInfo | null = null;
   private secondaryDropZones: Array<DropZoneInfo>;
   private dropZones: Array<DropZoneInfo>;
   private treeData: LimbleTreeData | undefined;
   private treeOptions: ProcessedOptions | undefined;

   constructor(
      private readonly componentCreatorService: ComponentCreatorService,
      private readonly dragStateService: DragStateService
   ) {
      this.setActiveDropZoneInfo(null);
      this.secondaryDropZones = [];
      this.dropZones = [];
   }

   public init(treeData: LimbleTreeData, treeOptions: ProcessedOptions) {
      this.treeData = treeData;
      this.treeOptions = treeOptions;
   }

   public showSingleDropZone(dropZone: DropZoneInfo, active: boolean = true) {
      if (active === true) {
         this.removeActiveAndSecondaryZones();
      }
      const componentRef = this.componentCreatorService.appendComponent<DropZoneComponent>(
         DropZoneComponent,
         dropZone.container
      );
      componentRef.instance.active = active;
      componentRef.instance.dropZoneInfo = dropZone;
      if (active === true) {
         this.setActiveDropZoneInfo(dropZone);
      } else {
         this.secondaryDropZones.push(dropZone);
      }
   }

   public removeActiveAndSecondaryZones() {
      this.activeDropZoneInfo?.container.clear();
      this.setActiveDropZoneInfo(null);
      for (const secondaryZone of this.secondaryDropZones) {
         secondaryZone.container.clear();
      }
      this.secondaryDropZones = [];
   }

   public getActiveDropZoneInfo() {
      return this.activeDropZoneInfo;
   }

   private setActiveDropZoneInfo(dropZoneInfo: DropZoneInfo | null) {
      this.activeDropZoneInfo = dropZoneInfo;
      if (this.activeDropZoneInfo !== null) {
         this.dragStateService.droppable();
      } else if (this.dragStateService.getState() === "droppable") {
         this.dragStateService.notDroppable();
      }
   }

   public getDropZones() {
      return this.dropZones;
   }

   public getSecondaryDropZones() {
      return this.secondaryDropZones;
   }

   public addDropZone(dropZone: DropZoneInfo) {
      if (
         this.dropZones.find((registeredZone) => {
            return registeredZone.coordinates === dropZone.coordinates;
         }) === undefined
      ) {
         this.dropZones.push(dropZone);
      }
   }

   public clearDropZones() {
      this.removeActiveAndSecondaryZones();
      this.dropZones = [];
   }

   private isLastDropZoneInBranch(coordinates: BranchCoordinates): boolean {
      const group = this.getCoordinatesGroup(coordinates);
      if (group.length - 1 < coordinates[coordinates.length - 1]) {
         return true;
      }
      return false;
   }

   private isOnRoot(coordinates: BranchCoordinates): boolean {
      return coordinates.length === 1;
   }

   public showDropZoneFamily(
      dropZone: DropZoneInfo,
      active: boolean = true,
      skip: "below" | "above" | false = false
   ) {
      this.showSingleDropZone(dropZone, active);
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
         const secondaryDropZone = this.getDropZones().find((dropZoneInfo) => {
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
         const currentNode =
            this.dragStateService.getData()?.getCoordinates() ?? [];
         if (arraysAreEqual(currentNode, previousSibling)) {
            return;
         }
         const hasChildren = this.coordinatesHasChildren(previousSibling);
         if (hasChildren) {
            const previousSiblingFirstChild = [...previousSibling];
            previousSiblingFirstChild.push(0);
            let secondaryDropZoneCoordinates: BranchCoordinates = previousSiblingFirstChild;
            let next = this.getNextSibling(secondaryDropZoneCoordinates);
            while (next !== null) {
               secondaryDropZoneCoordinates = next;
               next = this.getNextSibling(secondaryDropZoneCoordinates);
            }
            const secondaryDropZone = this.getDropZones().find(
               (dropZoneInfo) => {
                  return arraysAreEqual(
                     dropZoneInfo.coordinates,
                     secondaryDropZoneCoordinates
                  );
               }
            );
            if (secondaryDropZone !== undefined) {
               this.showDropZoneFamily(secondaryDropZone, false, "below");
            }
         } else {
            const previousSiblingNode = this.getCoordinatesGroup(
               previousSibling
            )[previousSibling[previousSibling.length - 1]];
            if (isNestingAllowed(this.treeOptions, previousSiblingNode)) {
               const secondaryDropZoneCoordinates = [...previousSibling];
               secondaryDropZoneCoordinates.push(0);
               const secondaryDropZone = this.getDropZones().find(
                  (dropZoneInfo) => {
                     return arraysAreEqual(
                        dropZoneInfo.coordinates,
                        secondaryDropZoneCoordinates
                     );
                  }
               );
               if (secondaryDropZone !== undefined) {
                  this.showDropZoneFamily(secondaryDropZone, false, "below");
               }
            }
         }
      }
   }

   private coordinatesHasChildren(coordinates: BranchCoordinates): boolean {
      const children = this.getCoordinatesChildren(coordinates);
      return children !== undefined && children.length > 0;
   }

   public swapActiveDropZone(dropZoneInfo: DropZoneInfo) {
      if (this.getActiveDropZoneInfo() === null) {
         throw new Error("could not get active drop zone");
      }
      const secondaryDropZones = this.getSecondaryDropZones();
      const index = secondaryDropZones.findIndex((dropZone) => {
         return dropZone.coordinates === dropZoneInfo.coordinates;
      });
      if (index === -1) {
         throw new Error("failed to swap active drop zone");
      }
      this.showDropZoneFamily(dropZoneInfo);
   }

   private getNextSibling(
      coordinates: BranchCoordinates
   ): BranchCoordinates | null {
      const temp = [...coordinates];
      const group = this.getCoordinatesGroup(temp);
      const nextPosition = temp[temp.length - 1]++;
      if (group.length <= nextPosition) {
         return null;
      }
      return temp;
   }

   private getCoordinatesGroup(
      coordinates: BranchCoordinates
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
      coordinates: BranchCoordinates
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
}
