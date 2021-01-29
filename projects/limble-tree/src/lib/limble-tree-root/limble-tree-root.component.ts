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
import { DropZoneService } from "../singletons/drop-zone.service";
import type {
   LimbleTreeData,
   LimbleTreeOptions
} from "../limble-tree-root/tree.service";
import { TreeService } from "./tree.service";
import { isElementDescendant } from "../util";

@Component({
   selector: "limble-tree-root",
   templateUrl: "./limble-tree-root.component.html",
   styleUrls: ["./limble-tree-root.component.scss"],
   providers: [TreeService]
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

   @Output() readonly treeChange = new EventEmitter();

   private readonly changesSubscription: Subscription;

   constructor(
      private readonly treeService: TreeService,
      private readonly changeDetectorRef: ChangeDetectorRef,
      private readonly dropZoneService: DropZoneService
   ) {
      this.dropZoneInside$ = new BehaviorSubject(this.dropZoneInside);
      this.changesSubscription = this.treeService.changes$.subscribe(() => {
         this.treeChange.emit();
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

   ngOnDestroy() {
      this.changesSubscription.unsubscribe();
   }
}
