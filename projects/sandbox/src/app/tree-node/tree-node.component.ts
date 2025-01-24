import { Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

@Component({
   selector: "tree-node",
   templateUrl: "./tree-node.component.html",
   styleUrls: ["./tree-node.component.scss"],
   imports: [MatCardModule]
})
export class TreeNodeComponent {}
