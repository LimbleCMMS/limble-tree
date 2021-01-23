import { Component, Input } from "@angular/core";
import { DropZoneInfo } from "../singletons/drop-zone.service";
import { LimbleTreeService } from "../singletons/limble-tree.service";

@Component({
   selector: "drop-zone",
   templateUrl: "./drop-zone.component.html",
   styleUrls: ["./drop-zone.component.scss"]
})
export class DropZoneComponent {
   @Input() active: boolean = false;
   @Input() dropZoneInfo: DropZoneInfo | undefined;

   constructor(private readonly limbleTreeService: LimbleTreeService) {}

   public dragenterHandler() {
      if (this.active === true || this.dropZoneInfo === undefined) {
         return;
      }
      this.limbleTreeService.swapActiveDropZone(this.dropZoneInfo);
   }
}
