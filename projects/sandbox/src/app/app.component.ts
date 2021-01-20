import { Component } from "@angular/core";
import { LimbleTreeData } from "projects/limble-tree/src/public-api";

@Component({
   selector: "app-root",
   templateUrl: "./app.component.html",
   styleUrls: ["./app.component.scss"]
})
export class AppComponent {
   public limbleTreeData: LimbleTreeData = {
      nodes: [
         { data: { value1: "this thing", value2: "other thing" } },
         { data: { valueA: "this thing", valueB: "other thing" } }
      ]
   };
}
