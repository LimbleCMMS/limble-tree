import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   Input,
   OnChanges,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { DropZoneService } from "./singletons/drop-zone.service";
import { LimbleTreeData } from "./singletons/limble-tree.service";
import { TreeRendererService } from "./singletons/tree-renderer.service";
import { isElementDescendant } from "./util";

@Component({
   selector: "limble-tree",
   templateUrl: "./limble-tree.component.html",
   styles: ["./limble-tree.component.scss"]
})
export class LimbleTreeComponent implements AfterViewInit, OnChanges {
   @Input() treeData: LimbleTreeData | undefined;
   @Input() coordinates: Array<number> | undefined;
   @Input() indent: number;

   @ViewChild("host", { read: ViewContainerRef }) private host:
      | ViewContainerRef
      | undefined;

   constructor(
      private readonly treeRendererService: TreeRendererService,
      private readonly changeDetectorRef: ChangeDetectorRef,
      private readonly dropZoneService: DropZoneService
   ) {
      this.indent = 0;
   }

   ngAfterViewInit() {
      this.reRender();
      this.changeDetectorRef.detectChanges();
   }

   ngOnChanges() {
      if (this.host !== undefined && this.treeData !== undefined) {
         this.reRender();
      }
   }

   public reRender() {
      if (this.host === undefined) {
         throw new Error(
            "Failed to render limble tree. Failure occurred at root."
         );
      }
      if (this.treeData === undefined) {
         throw new Error(`limbleTree requires a data object`);
      }
      if (this.coordinates === undefined) {
         this.treeRendererService.renderRoot(this.host, this.treeData);
      } else {
         this.treeRendererService.render(
            this.host,
            this.treeData,
            this.coordinates
         );
      }
   }

   public dragoverHandler(event: DragEvent) {
      if (this.coordinates !== undefined || event.dataTransfer === null) {
         return;
      }
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
   }

   public dragleaveHandler(event: DragEvent) {
      if (
         this.coordinates !== undefined ||
         isElementDescendant(
            event.currentTarget as Node,
            event.relatedTarget as Node
         ) !== false
      ) {
         return;
      }
      this.dropZoneService.removeActiveAndSecondaryZones();
   }
}
