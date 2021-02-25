import { Injectable, ViewContainerRef } from "@angular/core";
import { Branch, BranchCoordinates } from "../Branch";
import { DragStateService } from "../singletons/drag-state.service";
import type { LimbleTreeNode, ProcessedOptions } from "./tree.service";
import { ComponentCreatorService } from "../singletons/component-creator.service";
import { DropZoneComponent } from "../drop-zone/drop-zone.component";
import { arraysAreEqual } from "../util";
import { HiddenBranch } from "../HiddenBranch";

interface DropZoneData {
   container: ViewContainerRef;
   family?: DropZoneFamily;
}

type DropZone = HiddenBranch<DropZoneData>;

interface DropZoneFamily {
   /** The deepest member of the family */
   founder: DropZone;
   members: Array<DropZone>;
}

@Injectable()
export class DropZoneService {
   private readonly dropZoneStack: Array<{
      dropZone: DropZone;
      coordinates: BranchCoordinates;
   }>;
   private readonly dropZoneInventory: Array<DropZone>;
   private readonly dropZoneFamilies: Array<DropZoneFamily>;
   private visibleFamily: DropZoneFamily | null;
   private activeDropZone: DropZone | null;
   private tree: Branch<any> | undefined;
   private treeWithDropZones: HiddenBranch<any> | undefined;
   private treeOptions: ProcessedOptions | undefined;

   constructor(
      private readonly dragStateService: DragStateService,
      private readonly componentCreatorService: ComponentCreatorService
   ) {
      this.dropZoneStack = [];
      this.dropZoneInventory = [];
      this.dropZoneFamilies = [];
      this.visibleFamily = null;
      this.activeDropZone = null;
      this.setActiveDropZone(null);
   }

   public addDropZone(
      coordinates: BranchCoordinates,
      container: ViewContainerRef
   ): void {
      if (
         this.dropZoneStack.find((registeredZone) =>
            arraysAreEqual(registeredZone.coordinates, coordinates)
         ) !== undefined
      ) {
         return;
      }
      const dropZone = new HiddenBranch({ container: container });
      this.dropZoneStack.push({ dropZone: dropZone, coordinates: coordinates });
   }

   public clear(): void {
      if (this.visibleFamily !== null) {
         for (const member of this.visibleFamily.members) {
            member.data.container.clear();
         }
         this.visibleFamily = null;
      }
      this.setActiveDropZone(null);
   }

   public getActiveDropZone(): DropZone | null {
      return this.activeDropZone;
   }

   public init(tree: Branch<any>, treeOptions: ProcessedOptions): void {
      this.tree = tree;
      this.treeOptions = treeOptions;
      this.reset();
      for (const dropZoneInfo of this.dropZoneStack) {
         if (
            !this.dropZoneInventory.find((zone) =>
               arraysAreEqual(zone.getCoordinates(), dropZoneInfo.coordinates)
            )
         ) {
            this.dropZoneInventory.push(dropZoneInfo.dropZone);
            this.addToTree(dropZoneInfo.dropZone, dropZoneInfo.coordinates);
         }
      }
      this.dropZoneStack.length = 0;
      this.assignFamilies();
   }

   public reset(): void {
      this.clear();
      this.dropZoneFamilies.length = 0;
      this.dropZoneInventory.length = 0;
      if (this.tree) {
         this.treeWithDropZones = HiddenBranch.fromBranch(this.tree);
      }
   }

   /**
    * Shows the drop zone family of the drop zone indicated by `coordinates`. The
    * drop zone indicated by `coordinates` becomes the active drop zone.
    */
   public showDropZoneAndFamily(coordinates: BranchCoordinates): void {
      if (
         this.activeDropZone !== null &&
         arraysAreEqual(this.activeDropZone.getCoordinates(), coordinates)
      ) {
         //Already showing the family with the appropriate active drop zone
         return;
      }
      if (this.visibleFamily !== null || this.activeDropZone !== null) {
         this.clear();
      }
      if (this.treeWithDropZones === undefined) {
         throw new Error("dropZoneService not initialized");
      }
      const target = this.treeWithDropZones.findByCoordinates(
         coordinates,
         true
      );
      if (target === undefined) {
         throw new Error("Could not find drop zone to show");
      }
      if (this.showDropZone(target, true) === false) {
         return;
      }
      const family = (target.data as DropZoneData).family;
      if (family === undefined) {
         throw new Error("No family");
      }
      this.visibleFamily = family;
      for (const member of family.members) {
         if (member !== target) {
            this.showDropZone(member);
         }
      }
   }

   public swapActiveDropZone(
      newActiveDropZoneCoordinates: BranchCoordinates
   ): void {
      if (this.getActiveDropZone() === null) {
         throw new Error("could not get active drop zone");
      }
      if (this.visibleFamily === null) {
         throw new Error("No visible family available for swapping");
      }
      const index = this.visibleFamily.members.findIndex((dropZone) => {
         return arraysAreEqual(
            dropZone.getCoordinates(),
            newActiveDropZoneCoordinates
         );
      });
      if (index === -1) {
         throw new Error("failed to swap active drop zone");
      }
      this.showDropZoneAndFamily(newActiveDropZoneCoordinates);
   }

   private addToTree(dropZone: DropZone, coordinates: BranchCoordinates): void {
      if (this.treeWithDropZones === undefined) {
         throw new Error("dropZoneService not initialized");
      }
      const parentCoordinates = [...coordinates];
      parentCoordinates.pop();
      const parent = this.treeWithDropZones.findByCoordinates(
         parentCoordinates
      );
      parent.addHiddenChild(dropZone, coordinates[coordinates.length - 1]);
   }

   private assignFamilies(): void {
      const orphanZones = [...this.dropZoneInventory];
      const deepestMembers = orphanZones
         .filter((zone) => {
            const coordinates = zone.getCoordinates();
            return coordinates[coordinates.length - 1] === 0;
         })
         .sort((memberA, memberB) => {
            const aCoordinates = memberA.getCoordinates();
            const bCoordinates = memberB.getCoordinates();
            if (aCoordinates.length > bCoordinates.length) {
               return -1;
            }
            if (aCoordinates.length < bCoordinates.length) {
               return 1;
            }
            for (let cursor = aCoordinates.length - 1; cursor >= 0; cursor--) {
               if (aCoordinates[cursor] > bCoordinates[cursor]) {
                  return -1;
               }
               if (aCoordinates[cursor] < bCoordinates[cursor]) {
                  return 1;
               }
            }
            return 0;
         });
      for (const dropZone of deepestMembers) {
         const family: DropZoneFamily = {
            founder: dropZone,
            members: []
         };
         dropZone.data.family = family;
         //See if there are any orphans that belong to this family and claim them.
         const cursor = [...dropZone.getCoordinates()];
         while (cursor.length > 0) {
            const familyMemberIndex = orphanZones.findIndex((zone) =>
               arraysAreEqual(zone.getCoordinates(), cursor)
            );
            if (familyMemberIndex !== -1) {
               const familyMember = orphanZones.splice(familyMemberIndex, 1)[0];
               family.members.push(familyMember);
               familyMember.data.family = family;
            }
            cursor.pop();
            cursor[cursor.length - 1]++;
         }
         this.dropZoneFamilies.push(family);
      }
      if (orphanZones.length !== 0) {
         throw new Error("Some zones were not assigned to a family");
      }
   }

   private setActiveDropZone(dropZone: DropZone | null): void {
      this.activeDropZone = dropZone;
      if (this.activeDropZone !== null) {
         this.dragStateService.droppable();
      } else if (this.dragStateService.getState() === "droppable") {
         this.dragStateService.notDroppable();
      }
   }

   private showDropZone(dropZone: DropZone, active = false): boolean {
      if (this.zoneIsUnderDraggedNode(dropZone)) {
         //Do not show drop zones inside the node being dragged.
         return false;
      }
      if (this.zoneIsExtraneous(dropZone)) {
         //Do not show drop zones that would put the item back where it was.
         return false;
      }
      if (!this.zoneIsAllowed(dropZone)) {
         //User settings indicate to skip this drop zone
         return false;
      }
      const parent = dropZone.getParent();
      if (parent === null) {
         throw new Error("Bad family member");
      }
      const componentRef = this.componentCreatorService.appendComponent<DropZoneComponent>(
         DropZoneComponent,
         dropZone.data.container
      );
      componentRef.instance.active = active;
      componentRef.instance.coordinates = dropZone.getCoordinates();
      if (active === true) {
         this.setActiveDropZone(dropZone);
      }
      return true;
   }

   private zoneIsAllowed(dropZone: DropZone): boolean {
      if (this.treeOptions === undefined) {
         throw new Error("dropZoneService not initialized");
      }
      const draggedNode = this.dragStateService.getData();
      if (draggedNode === undefined) {
         throw new Error("Can't get dragged node");
      }
      const dropZoneParent = dropZone.getParent() as HiddenBranch<LimbleTreeNode>;
      if (dropZoneParent === null) {
         throw new Error("Could not get drop zone parent");
      }
      const dropZoneIndex = dropZone.getIndex();
      if (dropZoneIndex === undefined) {
         throw new Error("Could not get drop zone index");
      }
      if (
         this.treeOptions.allowDrop(
            draggedNode.data,
            dropZoneParent.data,
            dropZoneIndex
         )
      ) {
         return true;
      }
      return false;
   }

   private zoneIsExtraneous(dropZone: DropZone): boolean {
      const draggedNode = this.dragStateService.getData();
      if (draggedNode === undefined) {
         throw new Error("Can't get dragged node");
      }
      const dropZoneCoordinates = dropZone.getCoordinates();
      const draggedNodeCoordinates = draggedNode.getCoordinates();
      if (arraysAreEqual(draggedNodeCoordinates, dropZoneCoordinates)) {
         return true;
      }
      const nextSlot = draggedNodeCoordinates;
      nextSlot[nextSlot.length - 1]++;
      if (arraysAreEqual(nextSlot, dropZoneCoordinates)) {
         return true;
      }
      return false;
   }

   private zoneIsUnderDraggedNode(dropZone: DropZone): boolean {
      const draggedNode = this.dragStateService.getData();
      if (draggedNode === undefined) {
         throw new Error("Can't get dragged node");
      }
      let cursor: HiddenBranch<any> | null = dropZone.getParent();
      while (cursor !== null) {
         if (
            arraysAreEqual(
               cursor.getCoordinates(),
               draggedNode.getCoordinates()
            )
         ) {
            return true;
         }
         cursor = cursor.getParent();
      }
      return false;
   }
}
