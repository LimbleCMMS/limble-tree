import { BranchCoordinates } from "./Branch";
import { DropZoneFamily } from "../limble-tree-root/drop-zone.service";
import { arraysAreEqual } from "../util";
import { Subject } from "rxjs";
import { DropZoneLocation } from "./DropZoneLocation";

export type CommMessage = "checkActive" | "checkVisible" | "checkBoth";

export class DropZone {
   public static dropZoneLocationsAreEqual(
      valueA: DropZone | DropZoneLocation,
      valueB: DropZone | DropZoneLocation
   ) {
      return arraysAreEqual(
         valueA.getFullInsertCoordinates(),
         valueB.getFullInsertCoordinates()
      );
   }

   private readonly location: DropZoneLocation;
   private visible: boolean;
   private active: boolean;
   private family: DropZoneFamily | undefined;
   private commChannel: Subject<CommMessage>;

   public constructor(
      parentCoordinates: BranchCoordinates,
      insertIndex: number
   ) {
      this.location = new DropZoneLocation(parentCoordinates, insertIndex);
      this.visible = false;
      this.active = false;
      this.commChannel = new Subject();
   }

   public isVisible(set: boolean | undefined = undefined): DropZone["visible"] {
      if (set !== undefined) {
         this.visible = set;
         if (this.commChannel !== undefined) {
            this.commChannel.next("checkVisible");
         }
         if (this.visible === false) {
            this.isActive(false);
         }
      }
      return this.visible;
   }

   public isActive(set: boolean | undefined = undefined): DropZone["active"] {
      if (set !== undefined) {
         this.active = set;
         if (this.commChannel !== undefined) {
            this.commChannel.next("checkActive");
         }
      }
      return this.active;
   }

   public getLocation(): DropZone["location"] {
      return this.location;
   }

   public getFamily(): DropZone["family"] {
      return this.family;
   }

   public setFamily(family: DropZoneFamily): void {
      this.family = family;
   }

   public getCommChannel(): Subject<CommMessage> {
      return this.commChannel;
   }

   public getFullInsertCoordinates() {
      return this.location.getFullInsertCoordinates();
   }
}
