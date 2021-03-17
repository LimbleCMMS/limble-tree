import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   EventEmitter,
   Input,
   NgZone,
   OnChanges,
   OnDestroy,
   Output,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { Subscription } from "rxjs";
import { DropZoneService } from "./drop-zone.service";
import {
   LimbleTreeData,
   LimbleTreeOptions,
   TreeDrop
} from "../limble-tree-root/tree.service";
import { TreeService } from "./tree.service";
import { isElementDescendant } from "../util";
import { DragStateService } from "../singletons/drag-state.service";
import { GlobalEventsService } from "../singletons/global-events.service";
import { first } from "rxjs/operators";

@Component({
   selector: "limble-tree-root",
   templateUrl: "./limble-tree-root.component.html",
   styleUrls: ["./limble-tree-root.component.scss"],
   providers: [TreeService, DropZoneService]
})
export class LimbleTreeRootComponent
   implements AfterViewInit, OnChanges, OnDestroy {
   @Input() data: LimbleTreeData | undefined;
   @Input() options: LimbleTreeOptions | undefined;
   @Input() itemsPerPage: number | undefined;
   @Input() page: number | undefined;

   @ViewChild("host", { read: ViewContainerRef }) private host:
      | ViewContainerRef
      | undefined;

   @Output() readonly treeChange = new EventEmitter<null>();

   @Output() readonly treeDrop = new EventEmitter<TreeDrop>();

   private readonly changesSubscription: Subscription;
   private readonly dropSubscription: Subscription;
   public placeholder: boolean;

   constructor(
      private readonly treeService: TreeService,
      private readonly dropZoneService: DropZoneService,
      private readonly dragStateService: DragStateService,
      private readonly globalEventsService: GlobalEventsService,
      private readonly changeDetectorRef: ChangeDetectorRef
   ) {
      this.changesSubscription = this.treeService.changes$.subscribe(() => {
         this.treeChange.emit();
      });
      this.dropSubscription = this.treeService.drops$.subscribe((drop) => {
         this.treeDrop.emit(drop);
      });
      this.placeholder = false;
      this.treeService.placeholder$.subscribe((value) => {
         this.placeholder = value;
         if (!NgZone.isInAngularZone()) {
            this.changeDetectorRef.detectChanges();
         }
      });
   }

   ngAfterViewInit() {
      if (
         this.options?.listMode !== true &&
         (this.itemsPerPage !== undefined || this.page !== undefined)
      ) {
         console.warn(
            "pagination is only allowed in listMode; `itemsPerPage` and `page` inputs will be ignored"
         );
      }
      this.update();
      this.changeDetectorRef.detectChanges();
   }

   ngOnChanges() {
      if (this.host !== undefined && this.data !== undefined) {
         this.update();
      }
   }

   /** Rebuild the tree */
   public update() {
      if (this.host === undefined) {
         throw new Error(
            "Failed to render limble tree. Failure occurred at root."
         );
      }
      if (this.data === undefined) {
         throw new Error(`limbleTree requires a data object`);
      }
      this.treeService.init(
         this.host,
         this.data,
         this.options,
         this.itemsPerPage,
         this.page
      );
      this.globalEventsService.addScrolling();
   }

   public dragoverHandler(event: DragEvent) {
      if (event.dataTransfer === null) {
         return;
      }
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
   }

   public dragleaveHandler(event: DragEvent) {
      const currentTarget = event.currentTarget;
      const relatedTarget = event.relatedTarget;
      if (
         !(currentTarget instanceof Node) ||
         !(relatedTarget instanceof Node) ||
         isElementDescendant(currentTarget, relatedTarget) !== false
      ) {
         //event came from deeper in the tree. Ignore it.
         return;
      }
      //Mouse has left the tree, so clear the drop zones
      this.dropZoneService.clearVisibleZones();
      this.changeDetectorRef.detectChanges();
   }

   public dropHandler(event: DragEvent) {
      event.stopPropagation();
      if (this.dragStateService.getState() !== "droppable") {
         return;
      }
      const sourceBranch = this.dragStateService.capture();
      if (sourceBranch === undefined) {
         throw new Error("failed to get current branch in dragendHandler");
      }
      const dropZone = this.dropZoneService.getActiveDropZone();
      if (dropZone === null) {
         throw new Error("failed to get active drop zone at drop handler");
      }
      this.treeService.captured = true;
      this.dragStateService.state$
         .pipe(first((message) => message === "idle"))
         .subscribe(() => {
            this.treeService.captured = false;
         });
      this.dropZoneService.clearVisibleZones();
      this.treeService.drop(sourceBranch, dropZone.getFullInsertCoordinates());
   }

   ngOnDestroy() {
      this.changesSubscription.unsubscribe();
      this.dropSubscription.unsubscribe();
   }
}
