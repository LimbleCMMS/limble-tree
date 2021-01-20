import { Component, Input, OnInit } from "@angular/core";
import { LimbleTreeData } from "./limble-tree.service";

@Component({
   selector: "limble-tree",
   templateUrl: "./limble-tree.component.html",
   styles: ["./limble-tree.component.scss"]
})
export class LimbleTreeComponent implements OnInit {
   @Input() treeData: LimbleTreeData | undefined;

   ngOnInit() {
      console.log(this.treeData);
   }
}
