import { BranchCoordinates } from "./Branch";
import { DropZoneFamily } from "../limble-tree-root/drop-zone.service";
import { arraysAreEqual } from "../util";
import { Subject } from "rxjs";
import { DropZoneLocation } from "./DropZoneLocation";
import { ViewContainerRef } from "@angular/core";

export type CommMessage = "checkActive" | "checkVisible" | "checkRendered";

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

   private host: ViewContainerRef | undefined;
   private readonly location: DropZoneLocation;
   private visible: boolean;
   private active: boolean;
   private rendered: boolean;
   private family: DropZoneFamily | undefined;
   private readonly commChannel: Subject<CommMessage>;

   public constructor(
      parentCoordinates: BranchCoordinates,
      insertIndex: number
   ) {
      this.location = new DropZoneLocation(parentCoordinates, insertIndex);
      this.rendered = false;
      this.visible = false;
      this.active = false;
      this.commChannel = new Subject();
   }

   public isRendered(
      set: boolean | undefined = undefined
   ): DropZone["rendered"] {
      if (set !== undefined) {
         this.rendered = set;
         if (this.commChannel !== undefined) {
            this.commChannel.next("checkRendered");
         }
         if (this.rendered === false) {
            this.isVisible(false);
         }
      }
      return this.rendered;
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

   public setHost(host: ViewContainerRef | undefined) {
      this.host = host;
      return this.host;
   }

   public getHost() {
      return this.host;
   }
}
