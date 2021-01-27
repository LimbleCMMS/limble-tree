import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   Input,
   Output,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TreeService } from "../limble-tree-root/tree.service";
import { Branch } from "branches";

@Component({
   selector: "limble-tree-branch",
   templateUrl: "./limble-tree-branch.component.html",
   styles: ["./limble-tree-branch.component.scss"]
})
export class LimbleTreeBranchComponent implements AfterViewInit {
   @Input() branch: Branch<any> | undefined;

   @ViewChild("host", { read: ViewContainerRef }) private host:
      | ViewContainerRef
      | undefined;

   @ViewChild("dropZoneInside", { read: ViewContainerRef })
   dropZoneInside: ViewContainerRef | undefined;

   @Output()
   readonly dropZoneInside$: BehaviorSubject<ViewContainerRef | undefined>;

   public readonly indent;

   constructor(
      private readonly treeService: TreeService,
      private readonly changeDetectorRef: ChangeDetectorRef
   ) {
      this.dropZoneInside$ = new BehaviorSubject(this.dropZoneInside);
      this.indent = this.treeService.treeOptions?.indent;
   }

   ngAfterViewInit() {
      this.dropZoneInside$.next(this.dropZoneInside);
      this.dropZoneInside$.complete();
      this.reRender();
      this.changeDetectorRef.detectChanges();
   }

   public reRender() {
      if (this.host === undefined || this.branch === undefined) {
         throw new Error("Failed to render limble tree branch");
      }
      this.treeService.renderBranch(this.host, this.branch);
   }
}
