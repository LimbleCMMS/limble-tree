import { Component, Input } from "@angular/core";
import type { DropZoneInfo } from "../singletons/drop-zone.service";
import { DropZoneService } from "../singletons/drop-zone.service";

@Component({
   selector: "drop-zone",
   templateUrl: "./drop-zone.component.html",
   styleUrls: ["./drop-zone.component.scss"]
})
export class DropZoneComponent {
   @Input() active: boolean = false;
   @Input() dropZoneInfo: DropZoneInfo | undefined;

   constructor(private readonly dropZoneService: DropZoneService) {}

   public dragenterHandler() {
      if (this.active === true || this.dropZoneInfo === undefined) {
         return;
      }
      this.dropZoneService.swapActiveDropZone(this.dropZoneInfo);
   }
}
