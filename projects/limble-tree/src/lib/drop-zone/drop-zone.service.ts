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

   public showDropZone(
      dropZoneRef: ViewContainerRef,
      dropCoordinates: Array<number>,
      modifier: 0 | 1 | -1 = 0
   ) {
      this.removeDropZone();
      this.currentDropZoneContainer = dropZoneRef;
      const componentRef = this.componentCreatorService.appendComponent<DropZoneComponent>(
         DropZoneComponent,
         dropZoneRef
      );
      componentRef.instance.dropZoneCoordinates = dropCoordinates;
      componentRef.instance.modifier = modifier;
   }

   public removeDropZone() {
      this.currentDropZoneContainer?.clear();
      this.currentDropZoneContainer = null;
   }

   public getCurrentDropZoneContainer() {
      return this.currentDropZoneContainer;
   }
}
