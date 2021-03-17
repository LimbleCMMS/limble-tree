import {
   AfterViewInit,
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   OnDestroy,
   OnInit
} from "@angular/core";
import { Subscription } from "rxjs";
import { DropZone } from "../classes/DropZone";
import { DropZoneService } from "../limble-tree-root/drop-zone.service";
import { TreeService } from "../limble-tree-root/tree.service";

@Component({
   selector: "limble-tree-placeholder",
   templateUrl: "./limble-tree-placeholder.component.html",
   styleUrls: ["./limble-tree-placeholder.component.scss"],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class LimbleTreePlaceholderComponent
   implements OnInit, AfterViewInit, OnDestroy {
   public dropZone: DropZone | undefined;
   private readonly placeholderSubscription: Subscription;

   public constructor(
      private readonly dropZoneService: DropZoneService,
      private readonly changeDetectorRef: ChangeDetectorRef,
      private readonly treeService: TreeService
   ) {
      //This logic is very similar to what the lifecycle hooks of this component do.
      //We use this subscription because sometimes we can't wait for the lifecycle hooks:
      //Specifically, the drop zone registration and deregistration sometimes can't happen
      //asynchronously without causing bugs. So we handle it synchronously here as well.
      this.placeholderSubscription = this.treeService.placeholder$.subscribe(
         (value) => {
            if (this.dropZone === undefined) {
               return;
            }
            this.dropZoneService.removeDropZone(this.dropZone);
            if (value === true) {
               this.dropZoneService.addDropZone(this.dropZone);
               this.dropZone.setHost(this.treeService.host);
            }
         }
      );
   }

   public ngOnInit() {
      this.dropZone = new DropZone([], 0);
      this.dropZoneService.addDropZone(this.dropZone);
   }

   public ngAfterViewInit() {
      if (this.dropZone === undefined) {
         throw new Error("placeholder drop zone is not defined");
      }
      this.dropZone.setHost(this.treeService.host);
      this.changeDetectorRef.detectChanges();
   }

   public dragoverHandler() {
      if (this.dropZone === undefined) {
         return;
      }
      this.dropZoneService.showDropZoneFamily(this.dropZone);
   }

   public ngOnDestroy() {
      this.placeholderSubscription.unsubscribe();
      if (this.dropZone === undefined) {
         throw new Error("could not remove placeholder drop zone");
      }
      this.dropZoneService.removeDropZone(this.dropZone);
   }
}
