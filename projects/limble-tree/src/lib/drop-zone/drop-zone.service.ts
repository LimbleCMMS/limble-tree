import { Injectable, ViewContainerRef } from "@angular/core";
import { ComponentCreatorService } from "../componentCreator.service";
import { DropZoneComponent } from "./drop-zone.component";

@Injectable()
export class DropZoneService {
   private currentDropZoneContainer: ViewContainerRef | null;

   constructor(
      private readonly componentCreatorService: ComponentCreatorService
   ) {
      this.currentDropZoneContainer = null;
   }

   public showDropZone(dropZoneRef: ViewContainerRef) {
      this.removeDropZone();
      this.currentDropZoneContainer = dropZoneRef;
      this.componentCreatorService.appendComponent<DropZoneComponent>(
         DropZoneComponent,
         dropZoneRef
      );
   }

   public removeDropZone() {
      this.currentDropZoneContainer?.clear();
   }

   public getCurrentDropZoneContainer() {
      return this.currentDropZoneContainer;
   }
}
