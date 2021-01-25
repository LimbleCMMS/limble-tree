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
import { LimbleTreeData } from "../singletons/limble-tree.service";
import { TreeRendererService } from "../singletons/tree-renderer.service";
import { isElementDescendant } from "../util";

@Component({
   selector: "limble-tree-root",
   templateUrl: "./limble-tree-root.component.html",
   styleUrls: ["./limble-tree-root.component.scss"]
})
export class LimbleTreeRootComponent
   implements AfterViewInit, OnChanges, OnDestroy {
   @Input() treeData: LimbleTreeData | undefined;

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
      private readonly treeRendererService: TreeRendererService,
      private readonly changeDetectorRef: ChangeDetectorRef,
      private readonly dropZoneService: DropZoneService
   ) {
      this.dropZoneInside$ = new BehaviorSubject(this.dropZoneInside);
      this.changesSubscription = this.treeRendererService.changes$.subscribe(
         () => {
            this.treeChange.emit();
         }
      );
   }

   ngAfterViewInit() {
      this.dropZoneInside$.next(this.dropZoneInside);
      this.dropZoneInside$.complete();
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
      this.treeRendererService.renderRoot(this.host, this.treeData);
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
