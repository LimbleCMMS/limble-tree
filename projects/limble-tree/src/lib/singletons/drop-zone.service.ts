import { Injectable, ViewContainerRef } from "@angular/core";
import { ComponentCreatorService } from "./component-creator.service";
import { DropZoneComponent } from "../drop-zone/drop-zone.component";

export interface DropZoneInfo {
   container: ViewContainerRef;
   coordinates: Array<number>;
}

@Injectable()
export class DropZoneService {
   private activeDropZoneInfo: DropZoneInfo | null;
   private secondaryDropZones: Array<DropZoneInfo>;
   private dropZones: Array<DropZoneInfo>;

   constructor(
      private readonly componentCreatorService: ComponentCreatorService
   ) {
      this.activeDropZoneInfo = null;
      this.secondaryDropZones = [];
      this.dropZones = [];
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
         this.activeDropZoneInfo = dropZone;
      } else {
         this.secondaryDropZones.push(dropZone);
      }
   }

   public removeActiveAndSecondaryZones() {
      this.activeDropZoneInfo?.container.clear();
      this.activeDropZoneInfo = null;
      for (const secondaryZone of this.secondaryDropZones) {
         secondaryZone.container.clear();
      }
      this.secondaryDropZones = [];
   }

   public getActiveDropZoneInfo() {
      return this.activeDropZoneInfo;
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
}
