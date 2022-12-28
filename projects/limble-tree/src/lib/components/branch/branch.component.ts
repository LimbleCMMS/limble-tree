import { Component, ViewChild, ViewContainerRef } from "@angular/core";
import { NodeComponent } from "../node-component";

@Component({
   selector: "branch",
   templateUrl: "./branch.component.html",
   styleUrls: ["./branch.component.scss"]
})
export class BranchComponent implements NodeComponent {
   @ViewChild("branchesContainer", { read: ViewContainerRef })
   branchesContainer: ViewContainerRef | undefined = undefined;
}
