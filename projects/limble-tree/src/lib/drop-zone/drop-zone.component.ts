import { Component, Input } from "@angular/core";
import { TempService } from "../temp.service";

@Component({
   selector: "drop-zone",
   templateUrl: "./drop-zone.component.html",
   styleUrls: ["./drop-zone.component.scss"]
})
export class DropZoneComponent {
   constructor(private readonly tempService: TempService) {}

   @Input() relativeToNode: "above" | "below" | undefined;

   public dropHandler(event: DragEvent) {
      console.log("dropped", event);
      const dropZone = event.target as HTMLElement;
      const draggedElement = this.tempService.get() as HTMLElement;
      if (draggedElement.parentNode === null || draggedElement.parentElement === null) {
         return;
      }
      draggedElement.parentElement.parentElement?.removeChild(
         draggedElement.parentElement
      );
      const desiredPlacement = dropZone.closest("limble-tree-node")?.parentElement;
      // console.log(desiredPlacement, draggedElement.parentElement);
      if (!desiredPlacement) {
         throw new Error("Failed to place dropped element");
      }
      if (this.relativeToNode === "above") {
         dropZone.closest("limble-tree-node")?.before(draggedElement.parentElement);
      } else if (this.relativeToNode === "below") {
         dropZone.closest("limble-tree-node")?.after(draggedElement.parentElement);
      } else {
         throw new Error("Failed to place dropped element");
      }
      this.tempService.delete();
   }

   public dragoverHandler(event: DragEvent) {
      //This is required because by default the browser prevents anything from happening while dropping onto the HTML element
      event.stopPropagation();
      event.preventDefault();
   }
}
