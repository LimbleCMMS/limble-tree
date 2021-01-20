import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   Input,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { LimbleTreeData, LimbleTreeService } from "./limble-tree.service";

@Component({
   selector: "limble-tree",
   templateUrl: "./limble-tree.component.html",
   styles: ["./limble-tree.component.scss"]
})
export class LimbleTreeComponent implements AfterViewInit {
   @Input() treeData: LimbleTreeData | undefined;

   @Input() offset: number;

   @ViewChild("host", { read: ViewContainerRef }) host:
      | ViewContainerRef
      | undefined;

   constructor(
      private readonly limbleTreeService: LimbleTreeService,
      private readonly changeDetectorRef: ChangeDetectorRef
   ) {
      this.offset = 0;
   }

   ngAfterViewInit() {
      if (this.host === undefined) {
         throw new Error(
            "Failed to render limble tree. Failure occurred at root."
         );
      }
      if (this.treeData === undefined) {
         throw new Error(`limbleTree requires a data object`);
      }
      this.limbleTreeService.render(this.host, this.treeData);
      this.changeDetectorRef.detectChanges();
   }
}
