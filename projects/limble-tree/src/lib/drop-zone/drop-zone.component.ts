import { Component, Input } from "@angular/core";
import { LimbleTreeService } from "../limble-tree.service";
import { TempService } from "../temp.service";

@Component({
   selector: "drop-zone",
   templateUrl: "./drop-zone.component.html",
   styleUrls: ["./drop-zone.component.scss"]
})
export class DropZoneComponent {
   constructor(
      private readonly tempService: TempService,
      private readonly limbleTreeService: LimbleTreeService
   ) {}

   @Input() dropZoneCoordinates: Array<number> | undefined;
   @Input() modifier: number = 0;

   public dropHandler() {
      const sourceCoordinates = this.tempService.get() as Array<number>;
      this.tempService.delete();
      if (this.dropZoneCoordinates === undefined) {
         throw new Error("could not determine drop zone location");
      }
      this.limbleTreeService.move(sourceCoordinates, this.dropZoneCoordinates);
   }

   public dragoverHandler(event: DragEvent) {
      //This is required because by default the browser prevents anything from happening while dragging
      event.stopPropagation();
      event.preventDefault();
      if (event.dataTransfer === null) {
         return;
      }
      event.dataTransfer.dropEffect = "move";
   }

   public dragleaveHandler(event: DragEvent) {
      if (event.dataTransfer === null) {
         return;
      }
      event.dataTransfer.dropEffect = "none";
   }
}
