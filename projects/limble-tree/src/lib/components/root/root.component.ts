import { Component, ViewChild, ViewContainerRef } from "@angular/core";
import { NodeComponent } from "../../components/node-component";

@Component({
   selector: "root",
   templateUrl: "./root.component.html",
   styleUrls: ["./root.component.scss"]
})
export class RootComponent implements NodeComponent {
   @ViewChild("branchesContainer", { read: ViewContainerRef })
   branchesContainer: ViewContainerRef | undefined = undefined;
}
