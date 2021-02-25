import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BranchCoordinates } from "../Branch";
import { DropZoneService } from "../limble-tree-root/drop-zone.service";

@Component({
   selector: "drop-zone",
   templateUrl: "./drop-zone.component.html",
   styleUrls: ["./drop-zone.component.scss"],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropZoneComponent {
   @Input() active: boolean = false;
   @Input() coordinates: BranchCoordinates | undefined;

   constructor(private readonly dropZoneService: DropZoneService) {}

   public dragenterHandler() {
      if (this.active === true || this.coordinates === undefined) {
         return;
      }
      this.dropZoneService.swapActiveDropZone(this.coordinates);
   }
}
