import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   ElementRef,
   Input,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { ComponentCreatorService } from "../singletons/component-creator.service";
import { DropZoneService } from "../singletons/drop-zone.service";
import { LimbleTreeBranchComponent } from "../limble-tree-branch/limble-tree-branch.component";
import { TempService } from "../singletons/temp.service";
import { TreeService } from "../limble-tree-root/tree.service";
import type { Branch } from "../branch";
import { isDraggingAllowed, isNestingAllowed } from "../util";

@Component({
   selector: "limble-tree-node",
   templateUrl: "./limble-tree-node.component.html",
   styleUrls: ["./limble-tree-node.component.scss"]
})
export class LimbleTreeNodeComponent implements AfterViewInit {
   @Input() branch: Branch<any> | undefined;
   @ViewChild("nodeHost", { read: ViewContainerRef }) private nodeHost:
      | ViewContainerRef
      | undefined;
   @ViewChild("dropZoneAbove", { read: ViewContainerRef })
   private dropZoneAbove: ViewContainerRef | undefined;
   @ViewChild("dropZoneBelow", { read: ViewContainerRef })
   private dropZoneBelow: ViewContainerRef | undefined;
   private dropZoneInside: ViewContainerRef | undefined;
   @ViewChild("children", { read: ViewContainerRef }) private children:
      | ViewContainerRef
      | undefined;
   @ViewChild("draggableDiv", { read: ElementRef }) private draggableDiv:
      | ElementRef<HTMLElement>
      | undefined;

   constructor(
      private readonly componentCreatorService: ComponentCreatorService,
      private readonly changeDetectorRef: ChangeDetectorRef,
      private readonly tempService: TempService,
      private readonly dropZoneService: DropZoneService,
      private readonly treeService: TreeService
   ) {}

   ngAfterViewInit() {
      this.registerDropZones();
      this.renderSelf();
      this.renderChildren();
      this.checkForHandle();
      this.changeDetectorRef.detectChanges();
   }

   public dragstartHandler(event: DragEvent): void {
      event.stopPropagation();
      if (event.dataTransfer === null || this.branch === undefined) {
         return;
      }
      const draggedElement = event.target as HTMLElement;
      if (draggedElement.parentElement?.tagName !== "LIMBLE-TREE-NODE") {
         return;
      }
      event.dataTransfer.effectAllowed = "move";
      draggedElement.classList.add("dragging");
      this.tempService.set(this.branch);
   }

   public dragendHandler(event: DragEvent): void {
      event.stopPropagation();
      const draggedElement = event.target as HTMLElement;
      const sourceBranch = this.tempService.get();
      if (sourceBranch === undefined) {
         return;
      }
      this.tempService.delete();
      draggedElement.classList.remove("dragging");
      const dropZoneInfo = this.dropZoneService.getActiveDropZoneInfo();
      if (dropZoneInfo === null) {
         return;
      }
      this.dropZoneService.removeActiveAndSecondaryZones();
      if (dropZoneInfo.coordinates === undefined) {
         throw new Error("could not determine drop zone location");
      }
      this.treeService.move(sourceBranch, dropZoneInfo.coordinates);
   }

   public dragoverHandler(event: DragEvent) {
      if (this.tempService.get() === undefined || this.branch === undefined) {
         return;
      }
      const sourceBranch = this.tempService.get();
      if (sourceBranch === undefined) {
         return;
      }
      //If trying to drop on self, remove any remaining drop zones and return.
      if (sourceBranch === this.branch) {
         if (this.dropZoneService.getActiveDropZoneInfo() !== null) {
            this.dropZoneService.removeActiveAndSecondaryZones();
         }
         return;
      }
      const target = event.currentTarget as HTMLElement;
      const topLine = target.offsetHeight / 4; //an imaginary line 25% of the way down from the top of the element;
      const bottomLine = topLine * 3; //an imaginary line 25% of the way up from the bottom of the element;
      if (
         event.offsetY < topLine &&
         this.dropZoneAbove !== undefined &&
         this.dropZoneService.getActiveDropZoneInfo()?.container !==
            this.dropZoneAbove
      ) {
         const dropCoordinates = [...this.branch.getCoordinates()];
         this.dropZoneService.showDropZoneFamily({
            container: this.dropZoneAbove,
            coordinates: dropCoordinates
         });
      } else if (
         event.offsetY < bottomLine &&
         this.dropZoneInside !== undefined &&
         this.dropZoneService.getActiveDropZoneInfo()?.container !==
            this.dropZoneInside
      ) {
         const dropCoordinates = [...this.branch.getCoordinates()];
         dropCoordinates.push(0);
         this.dropZoneService.showDropZoneFamily({
            container: this.dropZoneInside,
            coordinates: dropCoordinates
         });
      } else if (
         event.offsetY >= bottomLine &&
         this.dropZoneBelow !== undefined &&
         this.dropZoneService.getActiveDropZoneInfo()?.container !==
            this.dropZoneBelow &&
         this.branch.getChildren().length !== 0
      ) {
         const dropCoordinates = [...this.branch.getCoordinates()];
         dropCoordinates[dropCoordinates.length - 1]++;
         this.dropZoneService.showDropZoneFamily({
            container: this.dropZoneBelow,
            coordinates: dropCoordinates
         });
      }
   }

   private renderSelf() {
      if (this.nodeHost === undefined || this.branch === undefined) {
         throw new Error("Failed to render tree node");
      }
      let component = this.branch.data.component;
      if (component === undefined) {
         component = this.treeService.treeOptions?.defaultComponent;
      }
      if (component === undefined) {
         throw new Error("limbleTree requires a component to render");
      }
      const componentRef = this.componentCreatorService.appendComponent<any>(
         component.class,
         this.nodeHost
      );
      componentRef.instance.nodeData = this.branch.data;
      for (const binding in component.bindings) {
         componentRef.instance[binding] = component.bindings[binding];
      }
   }

   private renderChildren() {
      if (this.children !== undefined) {
         if (this.branch === undefined) {
            throw new Error("branch is undefined");
         }
         const newBranchComponent = this.componentCreatorService.appendComponent<LimbleTreeBranchComponent>(
            LimbleTreeBranchComponent,
            this.children
         );
         newBranchComponent.instance.branch = this.branch;
         if (isNestingAllowed(this.treeService.treeOptions, this.branch.data)) {
            newBranchComponent.instance.dropZoneInside$.subscribe(
               (dropZone) => {
                  if (
                     dropZone !== undefined &&
                     this.treeService.treeOptions?.allowDragging !== false
                  ) {
                     this.dropZoneInside = dropZone;
                     if (this.branch === undefined) {
                        throw new Error("failed to register inner drop zone");
                     }
                     const dropCoordinatesInside = this.branch.getCoordinates();
                     dropCoordinatesInside.push(0);
                     this.dropZoneService.addDropZone({
                        container: this.dropZoneInside,
                        coordinates: dropCoordinatesInside
                     });
                  }
               }
            );
         }
      }
   }

   private registerDropZones() {
      if (this.treeService.treeOptions?.allowDragging === false) {
         return;
      }
      if (
         this.dropZoneAbove === undefined ||
         this.dropZoneBelow === undefined ||
         this.branch === undefined
      ) {
         throw new Error("failed to register drop zones");
      }
      const currentCoordinates = this.branch.getCoordinates();
      const dropCoordinatesAbove = [...currentCoordinates];
      this.dropZoneService.addDropZone({
         container: this.dropZoneAbove,
         coordinates: dropCoordinatesAbove
      });
      const dropCoordinatesBelow = [...currentCoordinates];
      dropCoordinatesBelow[dropCoordinatesBelow.length - 1]++;
      this.dropZoneService.addDropZone({
         container: this.dropZoneBelow,
         coordinates: dropCoordinatesBelow
      });
   }

   private checkForHandle(): void {
      if (this.draggableDiv === undefined) {
         return;
      }
      const element = this.draggableDiv.nativeElement;
      const handle = element.querySelector(".limble-tree-handle");
      if (!isDraggingAllowed(this.treeService.treeOptions, this.branch?.data)) {
         element.setAttribute("draggable", "false");
      } else if (handle === null) {
         element.setAttribute("draggable", "true");
      } else {
         handle.addEventListener("mousedown", () => {
            element.setAttribute("draggable", "true");
         });
         handle.addEventListener("mouseup", () => {
            element.setAttribute("draggable", "false");
         });
      }
   }
}
