import {
   ComponentRef,
   Injectable,
   NgZone,
   ViewContainerRef
} from "@angular/core";
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
   componentRef?: ComponentRef<DropZoneComponent>;
}

type DropZone = HiddenBranch<DropZoneData>;

interface DropZoneFamily {
   /** The deepest member of the family */
   founder: DropZone;
   members: Array<DropZone>;
}

function sortFamily(memberA: DropZone, memberB: DropZone) {
   const aCoordinates = memberA.getCoordinates();
   const bCoordinates = memberB.getCoordinates();
   if (aCoordinates.length > bCoordinates.length) {
      return -1;
   }
   if (aCoordinates.length < bCoordinates.length) {
      return 1;
   }
   return 0;
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
   private tempFamilies:
      | readonly [DropZoneFamily, DropZoneFamily | null]
      | readonly [];

   constructor(
      private readonly dragStateService: DragStateService,
      private readonly componentCreatorService: ComponentCreatorService
   ) {
      this.dropZoneStack = [];
      this.dropZoneInventory = [];
      this.dropZoneFamilies = [];
      this.visibleFamily = null;
      this.activeDropZone = null;
      this.tempFamilies = [];
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

   /** Clears the view of drop zones, but keeps all the drop zone information */
   public clear(): void {
      if (this.visibleFamily !== null) {
         for (const member of this.visibleFamily.members) {
            member.data.container.clear();
         }
         this.visibleFamily = null;
      }
      this.restoreFamilies();
      this.setActiveDropZone(null);
   }

   public getActiveDropZone(): DropZoneService["activeDropZone"] {
      return this.activeDropZone;
   }

   public init(tree: Branch<any>, treeOptions: ProcessedOptions): void {
      this.tree = tree;
      this.treeOptions = treeOptions;
      this.reset();
      if (this.dropZoneStack.length === 0) {
         //No need to continue
         return;
      }
      for (const dropZoneInfo of this.dropZoneStack) {
         this.dropZoneInventory.push(dropZoneInfo.dropZone);
         this.addToTree(dropZoneInfo.dropZone, dropZoneInfo.coordinates);
      }
      this.dropZoneStack.length = 0;
      this.assignFamilies();
   }

   /** clears the view of drop zones and deletes all the drop zone information
    * EXCEPT for the dropZoneStack */
   public reset(): void {
      this.clear();
      this.dropZoneFamilies.length = 0;
      this.dropZoneInventory.length = 0;
      if (this.tree) {
         this.treeWithDropZones = HiddenBranch.fromBranch(this.tree);
      }
   }

   /** Sets the service back to the initial state: clears the view of drop zones,
    * deletes all the drop zone information, and empties the dropZoneStack.
    */
   public restart(): void {
      this.reset();
      this.dropZoneStack.length = 0;
   }

   public restoreFamilies(): void {
      if (this.tempFamilies.length === 2) {
         this.dropZoneFamilies.pop();
         this.dropZoneFamilies.push(this.tempFamilies[0]);
         for (const member of this.tempFamilies[0].members) {
            member.data.family = this.tempFamilies[0];
         }
         if (this.tempFamilies[1] !== null) {
            this.dropZoneFamilies.push(this.tempFamilies[1]);
            for (const member of this.tempFamilies[1].members) {
               member.data.family = this.tempFamilies[1];
            }
         }
         this.tempFamilies = [];
      }
   }

   /**
    * Shows the drop zone family of the drop zone indicated by `coordinates`.
    */
   public showDropZoneFamily(
      coordinates: BranchCoordinates,
      options: {
         joinFamilies?: boolean;
         activateLowestInsteadOfFounder?: boolean;
      } = { joinFamilies: false, activateLowestInsteadOfFounder: false }
   ): void {
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
      const family = (target.data as DropZoneData).family;
      if (options.joinFamilies === true) {
         const coordinates2 = [...coordinates];
         coordinates2[coordinates2.length - 1]++;
         const target2 = this.treeWithDropZones.findByCoordinates(
            coordinates2,
            true
         );
         if (target2 === undefined) {
            throw new Error("Could not find drop zone to show");
         }
         const family2 = (target2.data as DropZoneData).family;
         if (family === undefined || family2 === undefined) {
            throw new Error("No family");
         }
         const newFamily = {
            founder: family.founder,
            members: [...family.members]
         };
         this.showDropZone(family.founder, true);
         for (const member of family.members.sort(sortFamily)) {
            member.data.family = newFamily;
            if (member !== family.founder) {
               if (this.activeDropZone === null) {
                  //Failed to activate a zone so far, so activate this one instead
                  this.showDropZone(member, true);
               } else {
                  this.showDropZone(member);
               }
            }
         }
         for (const member of family2.members) {
            member.data.family = newFamily;
            if (
               member.getCoordinates().length < target2.getCoordinates().length
            ) {
               newFamily.members.push(member);
               this.showDropZone(member);
            }
         }
         //Temporarily store the old families
         this.tempFamilies = [family, family2];
         //Remove the old families
         const familyIndex = this.dropZoneFamilies.indexOf(family);
         this.dropZoneFamilies.splice(familyIndex, 1);
         const family2Index = this.dropZoneFamilies.indexOf(family2);
         this.dropZoneFamilies.splice(family2Index, 1);
         //Add the new family
         this.dropZoneFamilies.push(newFamily);
         this.visibleFamily = newFamily;
      } else {
         if (family === undefined) {
            throw new Error("No family");
         }
         this.visibleFamily = family;
         this.showDropZone(family.founder, true);
         for (const member of family.members.sort(sortFamily)) {
            if (member !== family.founder) {
               if (this.activeDropZone === null) {
                  //Failed to activate a zone so far, so activate this one instead
                  this.showDropZone(member, true);
               } else {
                  this.showDropZone(member);
               }
            }
         }
      }
      if (options.activateLowestInsteadOfFounder === true) {
         const lowestMember = [...this.visibleFamily.members]
            .sort(sortFamily)
            .pop();
         if (lowestMember === undefined) {
            throw new Error("Could not get lowest member");
         }
         this.swapActiveDropZone(lowestMember.getCoordinates());
      }
   }

   public swapActiveDropZone(
      newActiveDropZoneCoordinates: BranchCoordinates
   ): void {
      if (this.visibleFamily === null) {
         throw new Error("No visible family available for swapping");
      }
      if (this.treeWithDropZones === undefined) {
         throw new Error("dropZoneService not initialized");
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
      const newActiveDropZone = this.treeWithDropZones.findByCoordinates(
         newActiveDropZoneCoordinates,
         true
      );
      if (newActiveDropZone === undefined) {
         throw new Error("Failed to get new drop zone");
      }
      this.setActiveDropZone(newActiveDropZone);
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
      if (parent === undefined) {
         throw new Error("could not get parent");
      }
      parent.addHiddenChild(dropZone, coordinates[coordinates.length - 1]);
   }

   private assignFamilies(): void {
      const orphanZones = [...this.dropZoneInventory];
      const deepestMembers = orphanZones
         .filter((zone) => {
            const coordinates = zone.getCoordinates();
            return (
               coordinates[coordinates.length - 1] === 0 &&
               coordinates.length > 1
            );
         })
         .sort((valueA, valueB) => {
            const aCoordinates = valueA.getCoordinates();
            const bCoordinates = valueB.getCoordinates();
            const length = Math.max(aCoordinates.length, bCoordinates.length);
            for (let index = 0; index < length; index++) {
               if ((aCoordinates[index] ?? -1) > (bCoordinates[index] ?? -1)) {
                  return -1;
               } else if (
                  (aCoordinates[index] ?? -1) < (bCoordinates[index] ?? -1)
               ) {
                  return 1;
               }
            }
            return 0;
         });
      for (const dropZone of deepestMembers) {
         if (!orphanZones.includes(dropZone)) {
            continue;
         }
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
      for (const dropZone of orphanZones.filter(
         (zone) => zone.getCoordinates().length === 1
      )) {
         const family: DropZoneFamily = {
            founder: dropZone,
            members: [dropZone]
         };
         dropZone.data.family = family;
         this.dropZoneFamilies.push(family);
         orphanZones.splice(orphanZones.indexOf(dropZone), 1);
      }
      if (orphanZones.length !== 0) {
         let orphans = "";
         for (const zone of orphanZones) {
            orphans += `${JSON.stringify(zone.getCoordinates())}, `;
         }
         orphans = orphans.slice(0, orphans.length - 2);
         throw new Error(
            `Some zones were not assigned to a family. The orphan zones have the following coordinates: ${orphans}`
         );
      }
   }

   private setActiveDropZone(dropZone: DropZone | null): void {
      if (this.activeDropZone?.data.componentRef) {
         this.activeDropZone.data.componentRef.instance.active = false;
         if (!NgZone.isInAngularZone()) {
            this.activeDropZone.data.componentRef.changeDetectorRef.detectChanges();
         }
      }
      this.activeDropZone = dropZone;
      if (
         this.activeDropZone !== null &&
         this.dragStateService.getState() !== "droppable"
      ) {
         this.dragStateService.droppable();
      } else if (
         this.activeDropZone === null &&
         this.dragStateService.getState() === "droppable"
      ) {
         this.dragStateService.notDroppable();
      }
      if (this.activeDropZone?.data.componentRef) {
         this.activeDropZone.data.componentRef.instance.active = true;
         if (!NgZone.isInAngularZone()) {
            this.activeDropZone.data.componentRef.changeDetectorRef.detectChanges();
         }
      }
   }

   private showDropZone(dropZone: DropZone, active = false): boolean {
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
      dropZone.data.componentRef = componentRef;
      //We use this zone check in case we are running outside of angular, which happens
      //often due to the way we catch dragover events using the DragoverNoChangeDetect
      //directive
      if (!NgZone.isInAngularZone()) {
         componentRef.changeDetectorRef.detectChanges();
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
}
