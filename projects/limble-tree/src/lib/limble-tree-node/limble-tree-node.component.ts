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
import { DropZoneService } from "../limble-tree-root/drop-zone.service";
import { LimbleTreeBranchComponent } from "../limble-tree-branch/limble-tree-branch.component";
import { DragStateService } from "../singletons/drag-state.service";
import { LimbleTreeNode, TreeService } from "../limble-tree-root/tree.service";
import { Branch } from "../branch";
import { isDraggingAllowed, isNestingAllowed } from "../util";
import { filter, first, skipUntil, take } from "rxjs/operators";

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
      private readonly dragStateService: DragStateService,
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
         throw new Error("failed to run dragstartHandler");
      }
      const draggedElement = event.target as HTMLElement;
      if (draggedElement.parentElement?.tagName !== "LIMBLE-TREE-NODE") {
         //Don't drag stuff that isn't part of the tree
         return;
      }
      event.dataTransfer.effectAllowed = "move";
      draggedElement.classList.add("dragging");
      this.dragStateService.dragging(this.branch);
   }

   public dragendHandler(event: DragEvent): void {
      event.stopPropagation();
      const draggedElement = event.target as HTMLElement;
      draggedElement.classList.remove("dragging");
      if (this.branch === undefined) {
         throw new Error("failed to get current branch in dragendHandler");
      }
      if (this.dragStateService.getState() !== "captured") {
         //Wasn't dropped into a valid tree, so reset for next drag and
         //don't do anything else.
         this.dragStateService.release();
         return;
      }
      this.dragStateService.state$.pipe(take(2)).subscribe((state) => {
         if (state === "captured" && this.branch !== undefined) {
            this.treeService.remove(this.branch);
            this.dragStateService.release();
         }
      });
   }

   public dragoverHandler(event: DragEvent) {
      if (this.branch === undefined) {
         throw new Error("Can't get current branch during dragover event");
      }
      const sourceBranch = this.dragStateService.getData();
      if (sourceBranch === undefined) {
         //They might be dragging something that isn't a node. Just ignore it.
         return;
      }
      //If trying to drop on self, remove any existing drop zones and return.
      if (
         sourceBranch === this.branch ||
         this.branch.getAncestors().includes(sourceBranch)
      ) {
         if (this.dropZoneService.getActiveDropZoneInfo() !== null) {
            this.dropZoneService.removeActiveAndSecondaryZones();
         }
         return;
      }
      if (
         this.treeService.getPlaceholder() === true &&
         this.dropZoneAbove !== undefined
      ) {
         //If placeholder system is active, then activate the only existing drop zone
         //and skip the rest of the logic in this function
         const dropCoordinates = [...this.branch.getCoordinates()];
         this.dropZoneService.showDropZoneFamily({
            container: this.dropZoneAbove,
            coordinates: dropCoordinates
         });
         return;
      }
      const target = event.currentTarget as HTMLElement;
      const topLine = target.offsetHeight / 3; //an imaginary line 1/3 of the way down from the top of the element;
      const bottomLine = topLine * 2; //an imaginary line 1/3 of the way up from the bottom of the element;
      const parent = this.branch.getParent();
      let parentData: LimbleTreeNode;
      let parentNestingAllowed = true;
      if (parent?.data !== null) {
         parentData = parent?.data as LimbleTreeNode;
         parentNestingAllowed = isNestingAllowed(
            this.treeService.treeOptions,
            parentData
         );
      }
      if (
         event.offsetY < topLine &&
         this.dropZoneAbove !== undefined &&
         this.dropZoneService.getActiveDropZoneInfo()?.container !==
            this.dropZoneAbove &&
         parentNestingAllowed
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
         this.branch.getChildren().length === 0 &&
         parentNestingAllowed
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
      if (
         this.children !== undefined &&
         this.treeService.treeOptions?.listMode !== true
      ) {
         if (this.branch === undefined) {
            throw new Error("branch is undefined");
         }
         const newBranchComponent = this.componentCreatorService.appendComponent<LimbleTreeBranchComponent>(
            LimbleTreeBranchComponent,
            this.children
         );
         newBranchComponent.instance.branch = this.branch;
         if (
            isNestingAllowed(this.treeService.treeOptions, this.branch.data) &&
            !this.treeService.getPlaceholder() === true
         ) {
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
      const parent = this.branch.getParent();
      let parentData: LimbleTreeNode;
      if (parent?.data !== null) {
         parentData = parent?.data as LimbleTreeNode;
         if (!isNestingAllowed(this.treeService.treeOptions, parentData)) {
            return;
         }
      }
      const currentCoordinates = this.branch.getCoordinates();
      const dropCoordinatesAbove = [...currentCoordinates];
      this.dropZoneService.addDropZone({
         container: this.dropZoneAbove,
         coordinates: dropCoordinatesAbove
      });
      if (this.treeService.getPlaceholder() === true) {
         //Only register one drop zone if the placeholder system is active
         return;
      }
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
            //For some reason mouseup doesn't fire after a drag, so we use this observable sequence instead.
            const dragging = this.dragStateService.state$.pipe(
               filter((state) => state === "dragging"),
               first()
            );
            this.dragStateService.state$
               .pipe(
                  skipUntil(dragging),
                  filter((state) => state === "idle"),
                  first()
               )
               .subscribe(() => {
                  element.setAttribute("draggable", "false");
               });
         });
      }
   }
}
