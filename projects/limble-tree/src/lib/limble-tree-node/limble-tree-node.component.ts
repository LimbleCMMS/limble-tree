import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   Input,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { ComponentCreatorService } from "../componentCreator.service";
import { DropZoneService } from "../drop-zone/drop-zone.service";
import { LimbleTreeComponent } from "../limble-tree.component";
import {
   ComponentObj,
   INDENT,
   LimbleTreeNode,
   LimbleTreeService
} from "../limble-tree.service";
import { TempService } from "../temp.service";
import { arraysAreEqual } from "../util";

@Component({
   selector: "limble-tree-node",
   templateUrl: "./limble-tree-node.component.html",
   styleUrls: ["./limble-tree-node.component.scss"]
})
export class LimbleTreeNodeComponent implements AfterViewInit {
   @Input() component: ComponentObj | undefined;
   @Input() nodeData: LimbleTreeNode["data"];
   @Input() coordinates: Array<number> | undefined;
   @Input() childNodes: Array<LimbleTreeNode> | undefined;
   @ViewChild("nodeHost", { read: ViewContainerRef }) private nodeHost:
      | ViewContainerRef
      | undefined;
   @ViewChild("dropZoneAbove", { read: ViewContainerRef })
   private dropZoneAbove: ViewContainerRef | undefined;
   @ViewChild("dropZoneBelow", { read: ViewContainerRef })
   private dropZoneBelow: ViewContainerRef | undefined;
   @ViewChild("children", { read: ViewContainerRef }) private children:
      | ViewContainerRef
      | undefined;

   constructor(
      private readonly componentCreatorService: ComponentCreatorService,
      private readonly changeDetectorRef: ChangeDetectorRef,
      private readonly tempService: TempService,
      private readonly dropZoneService: DropZoneService,
      private readonly limbleTreeService: LimbleTreeService
   ) {}

   ngAfterViewInit() {
      this.renderSelf();
      this.renderChildren();
      this.changeDetectorRef.detectChanges();
   }

   public dragstartHandler(event: DragEvent): void {
      event.stopPropagation();
      if (event.dataTransfer === null) {
         return;
      }
      event.dataTransfer.effectAllowed = "move";
      const draggedElement = event.target as HTMLElement;
      draggedElement.classList.add("dragging");
      this.tempService.set(this.coordinates);
   }

   public dragendHandler(event: DragEvent): void {
      event.stopPropagation();
      const draggedElement = event.target as HTMLElement;
      const sourceCoordinates = this.tempService.get() as Array<number>;
      this.tempService.delete();
      const dropZoneInfo = this.dropZoneService.getCurrentDropZoneInfo();
      if (dropZoneInfo === null) {
         return;
      }
      if (dropZoneInfo.dropCoordinates === undefined) {
         throw new Error("could not determine drop zone location");
      }
      this.limbleTreeService.move(
         sourceCoordinates,
         dropZoneInfo.dropCoordinates
      );
      draggedElement.classList.remove("dragging");
      this.dropZoneService.removeDropZone();
   }

   public dragoverHandler(event: DragEvent) {
      if (
         this.tempService.get() === undefined ||
         this.coordinates === undefined
      ) {
         return;
      }
      const sourceCoordinates = this.tempService.get() as Array<number>;
      //If trying to drop on self, remove any remaining drop zones and return.
      if (
         arraysAreEqual(
            sourceCoordinates,
            this.coordinates.slice(0, sourceCoordinates.length)
         )
      ) {
         this.dropZoneService.removeDropZone();
         return;
      }
      const target = event.currentTarget as HTMLElement;
      const dividingLine = target.offsetHeight / 2;
      if (
         event.offsetY > dividingLine &&
         this.dropZoneBelow !== undefined &&
         this.dropZoneService.getCurrentDropZoneInfo()?.dropZoneContainer !==
            this.dropZoneBelow
      ) {
         const dropCoordinates = [...this.coordinates];
         dropCoordinates[dropCoordinates.length - 1]++;
         this.dropZoneService.showDropZone(this.dropZoneBelow, dropCoordinates);
      } else if (
         event.offsetY <= dividingLine &&
         this.dropZoneAbove !== undefined &&
         this.dropZoneService.getCurrentDropZoneInfo()?.dropZoneContainer !==
            this.dropZoneAbove
      ) {
         const dropCoordinates = [...this.coordinates];
         this.dropZoneService.showDropZone(this.dropZoneAbove, dropCoordinates);
      }
   }

   private renderSelf() {
      if (this.nodeHost === undefined || this.component === undefined) {
         throw new Error("Failed to render tree node");
      }
      const componentRef = this.componentCreatorService.appendComponent<any>(
         this.component.class,
         this.nodeHost
      );
      componentRef.instance.nodeData = this.nodeData;
      for (const binding in this.component.bindings) {
         componentRef.instance[binding] = this.component.bindings[binding];
      }
   }

   private renderChildren() {
      if (
         this.childNodes &&
         this.childNodes.length > 0 &&
         this.children !== undefined
      ) {
         if (this.coordinates === undefined) {
            throw new Error("coordinates are undefined");
         }
         const newBranch = this.componentCreatorService.appendComponent<LimbleTreeComponent>(
            LimbleTreeComponent,
            this.children
         );
         newBranch.instance.treeData = {
            nodes: this.childNodes,
            options: this.limbleTreeService.getTreeData().options
         };
         newBranch.instance.indent =
            this.limbleTreeService.getTreeData().options?.indent ?? INDENT;
         newBranch.instance.coordinates = [...this.coordinates];
      }
   }
}
