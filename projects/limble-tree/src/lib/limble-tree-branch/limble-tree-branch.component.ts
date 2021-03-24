import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   Input,
   NgZone,
   OnDestroy,
   OnInit,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { TreeService } from "../limble-tree-root/tree.service";
import type { Branch } from "../classes/Branch";
import { DropZone } from "../classes/DropZone";
import { filter } from "rxjs/operators";
import { isNestingAllowed } from "../util";
import { DropZoneService } from "../limble-tree-root/drop-zone.service";
import { TreeConstructionStatus } from "../limble-tree-root/tree-construction-status.service";

@Component({
   selector: "limble-tree-branch",
   templateUrl: "./limble-tree-branch.component.html",
   styles: ["./limble-tree-branch.component.scss"]
})
export class LimbleTreeBranchComponent
   implements AfterViewInit, OnInit, OnDestroy {
   @Input() branch: Branch<any> | undefined;

   @ViewChild("children", { read: ViewContainerRef }) children:
      | ViewContainerRef
      | undefined;

   public dropZoneInside: DropZone | undefined;
   public renderDropZoneInside: boolean;

   public readonly indent;

   constructor(
      private treeService: TreeService,
      private readonly changeDetectorRef: ChangeDetectorRef,
      private readonly dropZoneService: DropZoneService,
      private readonly treeConstructionStatus: TreeConstructionStatus,
      private readonly ngZone: NgZone
   ) {
      this.treeConstructionStatus.constructing();
      this.indent = this.treeService.treeOptions?.indent;
      this.renderDropZoneInside = false;
   }

   public ngOnInit() {
      this.addDropZoneInside();
      this.ngZone.runOutsideAngular(() => {
         if (this.dropZoneInside === undefined) {
            throw new Error("drop zone inside is not defined");
         }
         this.dropZoneInside
            .getCommChannel()
            .pipe(filter((message) => message === "checkRendered"))
            .subscribe(() => {
               if (
                  this.dropZoneInside === undefined ||
                  this.branch === undefined
               ) {
                  throw new Error("Zones not registered");
               }
               if (
                  isNestingAllowed(
                     this.treeService.treeOptions,
                     this.branch.data
                  )
               ) {
                  this.renderDropZoneInside = this.dropZoneInside.isRendered();
               }
            });
      });
   }

   public ngAfterViewInit() {
      this.reRender();
      this.setDropZoneHost();
      this.treeConstructionStatus.doneConstructing();
      this.changeDetectorRef.detectChanges();
   }

   public ngOnDestroy() {
      if (this.dropZoneInside !== undefined) {
         this.dropZoneService.removeDropZone(this.dropZoneInside);
      }
      this.treeService.cleanupSignal$.next(true);
   }

   private addDropZoneInside() {
      if (this.branch === undefined) {
         throw new Error("failed to register drop zone inside");
      }
      this.dropZoneInside = new DropZone([...this.branch.getCoordinates()], 0);
      this.dropZoneService.addDropZone(this.dropZoneInside);
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
