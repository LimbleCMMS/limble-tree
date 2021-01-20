import { Component, Input } from "@angular/core";

@Component({
   selector: "tree-item-alt",
   templateUrl: "./tree-item-alt.component.html",
   styleUrls: ["./tree-item-alt.component.scss"]
})
export class TreeItemAltComponent {
   @Input() nodeData: any;
   @Input() bgColor: string = "#555";
}
