import { Component, Input } from "@angular/core";
import { getLocationIndex, TreeLocationObj } from "../limble-tree.service";
import { TempService } from "../temp.service";

@Component({
   selector: "drop-zone",
   templateUrl: "./drop-zone.component.html",
   styleUrls: ["./drop-zone.component.scss"]
})
export class DropZoneComponent {
   constructor(private readonly tempService: TempService) {}

   @Input() dropZoneLocation: TreeLocationObj | undefined;
   @Input() modifier: number = 0;

   public dropHandler(event: DragEvent) {
      console.log("dropped", event);
      const sourceLocation = this.tempService.get() as TreeLocationObj;
      this.tempService.delete();
      if (this.dropZoneLocation === undefined) {
         return;
      }
      const source = sourceLocation.parentContainerRef.detach(
         getLocationIndex(sourceLocation)
      );
      if (source === null) {
         return;
      }
      const index = getLocationIndex(this.dropZoneLocation) + this.modifier;
      this.dropZoneLocation.parentContainerRef.insert(source, index);
   }

   public dragoverHandler(event: DragEvent) {
      //This is required because by default the browser prevents anything from happening while dragging
      event.stopPropagation();
      event.preventDefault();
   }
}
