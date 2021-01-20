import {
   AfterViewInit,
   Component,
   Input,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { NodeInserterService } from "./nodeInserter.service";
import { LimbleTreeData } from "./limble-tree.service";

@Component({
   selector: "limble-tree",
   templateUrl: "./limble-tree.component.html",
   styles: ["./limble-tree.component.scss"]
})
export class LimbleTreeComponent implements AfterViewInit {
   @Input() treeData: LimbleTreeData | undefined;
   @ViewChild("host", { read: ViewContainerRef }) host:
      | ViewContainerRef
      | undefined;

   constructor(private readonly componentCreatorService: NodeInserterService) {}

   ngAfterViewInit() {
      console.log(this.host, this.treeData);
      if (this.host === undefined || this.treeData === undefined) {
         throw new Error(
            "Failed to render limble tree. Failure occurred at root."
         );
      }
      for (const item of this.treeData.nodes) {
         this.componentCreatorService.appendNode(this.host, item);
      }
   }
}
