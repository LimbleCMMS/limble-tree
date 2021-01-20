import { Component } from "@angular/core";
import { LimbleTreeData } from "projects/limble-tree/src/public-api";
import { TreeItemAltComponent } from "./tree-item-alt/tree-item-alt.component";
import { TreeItemComponent } from "./tree-item/tree-item.component";

@Component({
   selector: "app-root",
   templateUrl: "./app.component.html",
   styleUrls: ["./app.component.scss"]
})
export class AppComponent {
   public limbleTreeData: LimbleTreeData = {
      nodes: [
         {
            data: { value1: "this thing" },
            nodes: [
               { data: { value1: "other thing" } },
               {
                  data: { value1: "another thing" },
                  nodes: [
                     { data: { value1: "his thing" } },
                     { data: { value1: "her thing" } }
                  ]
               }
            ]
         },
         { data: { value1: "that thing" } },
         {
            component: {
               class: TreeItemAltComponent,
               bindings: { bgColor: "#0070cc" }
            },
            data: { value1: "these things" }
         }
      ],
      options: {
         defaultComponent: { class: TreeItemComponent }
      }
   };
}
