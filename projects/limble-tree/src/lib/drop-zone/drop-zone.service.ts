import { Injectable, ViewContainerRef } from "@angular/core";
import { ComponentCreatorService } from "../componentCreator.service";
import { DropZoneComponent } from "./drop-zone.component";

@Injectable()
export class DropZoneService {
   private currentDropZoneInfo: {
      dropZoneContainer: ViewContainerRef;
      dropCoordinates: Array<number>;
   } | null;

   constructor(
      private readonly componentCreatorService: ComponentCreatorService
   ) {
      this.currentDropZoneInfo = null;
   }

   public showDropZone(
      dropZoneRef: ViewContainerRef,
      dropCoordinates: Array<number>
   ) {
      this.removeDropZone();
      this.currentDropZoneInfo = {
         dropZoneContainer: dropZoneRef,
         dropCoordinates: dropCoordinates
      };
      this.componentCreatorService.appendComponent<DropZoneComponent>(
         DropZoneComponent,
         dropZoneRef
      );
   }

   public removeDropZone() {
      this.currentDropZoneInfo?.dropZoneContainer.clear();
      this.currentDropZoneInfo = null;
   }

   public getCurrentDropZoneInfo() {
      return this.currentDropZoneInfo;
   }
}
