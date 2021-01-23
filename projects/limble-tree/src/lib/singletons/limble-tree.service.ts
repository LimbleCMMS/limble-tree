import { Injectable, Type } from "@angular/core";
import { arraysAreEqual } from "../util";
import { DropZoneInfo, DropZoneService } from "./drop-zone.service";
import { TreeRendererService } from "./tree-renderer.service";

export interface LimbleTreeNode {
   nodes?: Array<LimbleTreeNode>;
   data: unknown;
   component?: ComponentObj;
}

export interface LimbleTreeData {
   nodes: Array<LimbleTreeNode>;
   options?: LimbleTreeOptions;
}

export interface LimbleTreeOptions {
   defaultComponent?: ComponentObj;
   indent?: number;
}

export interface ComponentObj {
   class: Type<unknown>;
   bindings?: {
      [index: string]: unknown;
   };
}

export const INDENT = 45;

@Injectable({
   providedIn: "root"
})
export class LimbleTreeService {
   constructor(
      private readonly treeRendererService: TreeRendererService,
      private readonly dropZoneService: DropZoneService
   ) {}

   public move(
      sourceCoordinates: Array<number>,
      targetCoordinates: Array<number>
   ) {
      const sourceGroup = this.getCoordinatesGroup(sourceCoordinates);
      const sourceIndex = sourceCoordinates[sourceCoordinates.length - 1];
      const sourceNode = sourceGroup[sourceIndex];
      const targetGroup = this.getCoordinatesGroup(targetCoordinates);
      const targetIndex = targetCoordinates[targetCoordinates.length - 1];
      if (sourceGroup === targetGroup && sourceIndex < targetIndex) {
         //The node is moving down in its current branch, so we have to insert before we delete.
         this.insertNodeIntoGroup(sourceNode, targetGroup, targetIndex);
         this.removeNodeFromGroup(sourceNode, sourceGroup);
      } else {
         //The node is either:
         //(1) leaving its current branch, so we can do the insert and delete in any order; or
         //(2) moving up its current branch, so we have to delete first before inserting.
         this.removeNodeFromGroup(sourceNode, sourceGroup);
         this.insertNodeIntoGroup(sourceNode, targetGroup, targetIndex);
      }
      this.treeRendererService.renderRoot();
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

   private removeNodeFromGroup(
      node: LimbleTreeNode,
      nodeGroup: Array<LimbleTreeNode>
   ) {
      nodeGroup.splice(nodeGroup.indexOf(node), 1);
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
         } else {
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

   private insertNodeIntoGroup(
      node: LimbleTreeNode,
      nodeGroup: Array<LimbleTreeNode>,
      index: number
   ) {
      nodeGroup.splice(index, 0, node);
   }

   private getCoordinatesGroup(
      coordinates: Array<number>
   ): Array<LimbleTreeNode> {
      const treeData = this.treeRendererService.getTreeData();
      if (treeData === undefined) {
         throw new Error("treeData is not defined");
      }
      let group = treeData.nodes;
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
      const treeData = this.treeRendererService.getTreeData();
      if (treeData === undefined) {
         throw new Error("treeData is not defined");
      }
      let cursor = treeData.nodes;
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
