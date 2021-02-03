import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   EventEmitter,
   Input,
   OnChanges,
   OnDestroy,
   Output,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { DropZoneService } from "./drop-zone.service";
import {
   LimbleTreeData,
   LimbleTreeOptions,
   TreeDrop
} from "../limble-tree-root/tree.service";
import { TreeService } from "./tree.service";
import { isElementDescendant } from "../util";
import { DragStateService } from "../singletons/drag-state.service";

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

   @ViewChild("host", { read: ViewContainerRef }) private host:
      | ViewContainerRef
      | undefined;

   @ViewChild("dropZoneInside", { read: ViewContainerRef })
   dropZoneInside: ViewContainerRef | undefined;

   @Output()
   readonly dropZoneInside$: BehaviorSubject<ViewContainerRef | undefined>;

   @Output() readonly treeChange = new EventEmitter<null>();

   @Output() readonly treeDrop = new EventEmitter<TreeDrop>();

   private readonly changesSubscription: Subscription;
   private readonly dropSubscription: Subscription;

   constructor(
      private readonly treeService: TreeService,
      private readonly changeDetectorRef: ChangeDetectorRef,
      private readonly dropZoneService: DropZoneService,
      private readonly dragStateService: DragStateService
   ) {
      this.dropZoneInside$ = new BehaviorSubject(this.dropZoneInside);
      this.changesSubscription = this.treeService.changes$.subscribe(() => {
         this.treeChange.emit();
      });
      this.dropSubscription = this.treeService.drops$.subscribe((drop) => {
         this.treeDrop.emit(drop);
      });
   }

   ngAfterViewInit() {
      this.dropZoneInside$.next(this.dropZoneInside);
      this.dropZoneInside$.complete();
      this.update();
      this.changeDetectorRef.detectChanges();
   }

   ngOnChanges() {
      if (this.host !== undefined && this.data !== undefined) {
         this.update();
      }
   }

   public update() {
      if (this.host === undefined) {
         throw new Error(
            "Failed to render limble tree. Failure occurred at root."
         );
      }
      if (this.data === undefined) {
         throw new Error(`limbleTree requires a data object`);
      }
      this.treeService.init(this.host, this.data, this.options);
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
         return;
      }
      this.dropZoneService.removeActiveAndSecondaryZones();
   }

   public dropHandler(event: DragEvent) {
      event.stopPropagation();
      const dropZoneInfo = this.dropZoneService.getActiveDropZoneInfo();
      if (this.dragStateService.getState() !== "droppable") {
         return;
      }
      if (dropZoneInfo === null) {
         throw new Error("failed to get active drop zone at drop handler");
      }
      const sourceBranch = this.dragStateService.capture();
      if (sourceBranch === undefined) {
         throw new Error("failed to get current branch in dragendHandler");
      }
      this.dropZoneService.removeActiveAndSecondaryZones();
      this.treeService.drop(sourceBranch, dropZoneInfo.coordinates);
   }

   ngOnDestroy() {
      this.changesSubscription.unsubscribe();
      this.dropSubscription.unsubscribe();
   }
}
