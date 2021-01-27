import { Component, Input } from "@angular/core";
import { DropZoneInfo } from "../singletons/drop-zone.service";
import { TreeService } from "../limble-tree-root/tree.service";

@Component({
   selector: "drop-zone",
   templateUrl: "./drop-zone.component.html",
   styleUrls: ["./drop-zone.component.scss"]
})
export class DropZoneComponent {
   @Input() active: boolean = false;
   @Input() dropZoneInfo: DropZoneInfo | undefined;

   constructor(private readonly treeService: TreeService) {}

   public dragenterHandler() {
      if (this.active === true || this.dropZoneInfo === undefined) {
         return;
      }
      this.treeService.swapActiveDropZone(this.dropZoneInfo);
   }
}
