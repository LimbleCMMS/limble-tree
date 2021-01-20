import { Component, Input } from "@angular/core";

@Component({
   selector: "tree-item",
   templateUrl: "./tree-item.component.html",
   styleUrls: ["./tree-item.component.scss"]
})
export class TreeItemComponent {
   @Input() nodeData: any;
}
