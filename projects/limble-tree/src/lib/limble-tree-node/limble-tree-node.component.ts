import { Component, Input } from "@angular/core";
import { LimbleTreeNode } from "../limble-tree.service";

@Component({
   selector: "limble-tree-node",
   templateUrl: "./limble-tree-node.component.html",
   styleUrls: ["./limble-tree-node.component.scss"]
})
export class LimbleTreeNodeComponent {
   @Input() node: LimbleTreeNode | undefined;
}
