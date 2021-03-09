import {
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   Input,
   OnDestroy,
   OnInit
} from "@angular/core";
import { Subscription } from "rxjs";
import { DropZone } from "../classes/DropZone";
import { DropZoneService } from "../limble-tree-root/drop-zone.service";

@Component({
   selector: "drop-zone",
   templateUrl: "./drop-zone.component.html",
   styleUrls: ["./drop-zone.component.scss"],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropZoneComponent implements OnInit, OnDestroy {
   @Input() dropZone: DropZone | undefined;
   private commSubscription: Subscription | undefined;
   public visible: boolean;
   public active: boolean;

   constructor(
      private readonly dropZoneService: DropZoneService,
      private readonly changeDetectorRef: ChangeDetectorRef
   ) {
      this.visible = false;
      this.active = false;
   }

   public dragenterHandler() {
      if (this.dropZone === undefined || this.active === true) {
         return;
      }
      this.dropZoneService.swapActiveDropZone(this.dropZone);
   }

   public ngOnInit() {
      if (this.dropZone === undefined) {
         throw new Error("No drop zone object at component initialization");
      }
      this.commSubscription = this.dropZone
         .getCommChannel()
         .subscribe((message) => {
            switch (message) {
               case "checkVisible": {
                  this.visible = this.dropZone?.isVisible() ?? false;
                  break;
               }
               case "checkActive": {
                  this.active = this.dropZone?.isActive() ?? false;
                  break;
               }
               case "checkBoth": {
                  this.visible = this.dropZone?.isVisible() ?? false;
                  this.active = this.dropZone?.isActive() ?? false;
                  break;
               }
               default: {
                  throw new Error("unhandled comm message");
               }
            }
            this.changeDetectorRef.detectChanges();
         });
   }

   public ngOnDestroy() {
      if (this.commSubscription !== undefined) {
         this.commSubscription.unsubscribe();
      }
   }
}
