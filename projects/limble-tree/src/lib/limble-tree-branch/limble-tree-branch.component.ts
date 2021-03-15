import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   Input,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { TreeService } from "../limble-tree-root/tree.service";
import type { Branch } from "../classes/Branch";
import { DropZone } from "../classes/DropZone";

@Component({
   selector: "limble-tree-branch",
   templateUrl: "./limble-tree-branch.component.html",
   styles: ["./limble-tree-branch.component.scss"]
})
export class LimbleTreeBranchComponent implements AfterViewInit {
   @Input() branch: Branch<any> | undefined;

   @ViewChild("children", { read: ViewContainerRef }) children:
      | ViewContainerRef
      | undefined;

   @Input() dropZoneInside: DropZone | undefined;
   @Input() renderDropZoneInside: boolean;

   public readonly indent;

   constructor(
      private treeService: TreeService,
      private readonly changeDetectorRef: ChangeDetectorRef
   ) {
      this.indent = this.treeService.treeOptions?.indent;
      this.renderDropZoneInside = false;
   }

   public ngAfterViewInit() {
      this.reRender();
      this.setDropZoneHost();
      this.changeDetectorRef.detectChanges();
   }

   public reRender() {
      if (this.children === undefined || this.branch === undefined) {
         throw new Error("Failed to render limble tree branch");
      }
      this.treeService.renderBranch(this.children, this.branch);
   }

   private setDropZoneHost() {
      if (this.children === undefined || this.dropZoneInside === undefined) {
         throw new Error("Failed to add drop zone host");
      }
      this.dropZoneInside.setHost(this.children);
   }
}
