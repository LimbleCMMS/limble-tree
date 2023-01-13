import { Component, ViewChild, ViewContainerRef } from "@angular/core";
import { NodeComponent } from "../node-component.interface";

@Component({
   selector: "root",
   templateUrl: "./root.component.html",
   styleUrls: ["./root.component.scss"]
})
export class RootComponent implements NodeComponent {
   @ViewChild("branchesContainer", { read: ViewContainerRef })
   branchesContainer: ViewContainerRef | undefined = undefined;
}
