import {
   AfterViewInit,
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   DoCheck,
   Input,
   Output,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TreeService } from "../limble-tree-root/tree.service";
import type { Branch } from "../Branch";

@Component({
   selector: "limble-tree-branch",
   templateUrl: "./limble-tree-branch.component.html",
   styles: ["./limble-tree-branch.component.scss"],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class LimbleTreeBranchComponent implements AfterViewInit, DoCheck {
   @Input() branch: Branch<any> | undefined;

   @ViewChild("host", { read: ViewContainerRef }) private host:
      | ViewContainerRef
      | undefined;

   @ViewChild("dropZoneInside", { read: ViewContainerRef })
   dropZoneInside: ViewContainerRef | undefined;

   @Output()
   readonly dropZoneInside$: BehaviorSubject<ViewContainerRef | undefined>;

   public readonly indent;

   private readonly oldData: Map<string, unknown>;

   constructor(
      private readonly treeService: TreeService,
      private readonly changeDetectorRef: ChangeDetectorRef
   ) {
      this.dropZoneInside$ = new BehaviorSubject(this.dropZoneInside);
      this.indent = this.treeService.treeOptions?.indent;
      this.oldData = new Map();
   }

   ngAfterViewInit() {
      this.dropZoneInside$.next(this.dropZoneInside);
      this.dropZoneInside$.complete();
      this.oldData.set("collapsed", this.branch?.data.collapsed);
      this.reRender();
      this.changeDetectorRef.detectChanges();
   }

   ngDoCheck() {
      if (this.branch?.data.collapsed !== this.oldData.get("collapsed")) {
         this.changeDetectorRef.detectChanges();
         this.oldData.set("collapsed", this.branch?.data.collapsed);
      }
   }

   public reRender() {
      if (this.host === undefined || this.branch === undefined) {
         throw new Error("Failed to render limble tree branch");
      }
      this.treeService.renderBranch(this.host, this.branch);
   }
}
