import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   Input,
   OnChanges,
   Output,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LimbleTreeData } from "../singletons/limble-tree.service";
import { TreeRendererService } from "../singletons/tree-renderer.service";

@Component({
   selector: "limble-tree-branch",
   templateUrl: "./limble-tree-branch.component.html",
   styles: ["./limble-tree-branch.component.scss"]
})
export class LimbleTreeBranchComponent implements AfterViewInit, OnChanges {
   @Input() treeData: LimbleTreeData | undefined;
   @Input() coordinates: Array<number> | undefined;
   @Input() indent: number;

   @ViewChild("host", { read: ViewContainerRef }) private host:
      | ViewContainerRef
      | undefined;

   @ViewChild("dropZoneInside", { read: ViewContainerRef })
   dropZoneInside: ViewContainerRef | undefined;

   @Output()
   readonly dropZoneInside$: BehaviorSubject<ViewContainerRef | undefined>;

   constructor(
      private readonly treeRendererService: TreeRendererService,
      private readonly changeDetectorRef: ChangeDetectorRef
   ) {
      this.indent = 0;
      this.dropZoneInside$ = new BehaviorSubject(this.dropZoneInside);
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
      if (this.host === undefined || this.coordinates === undefined) {
         throw new Error("Failed to render limble tree branch");
      }
      if (this.treeData === undefined) {
         throw new Error(`limbleTree requires a data object`);
      }
      this.treeRendererService.render(
         this.host,
         this.treeData,
         this.coordinates
      );
   }
}
