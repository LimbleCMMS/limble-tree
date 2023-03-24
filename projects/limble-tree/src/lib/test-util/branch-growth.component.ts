import { Component, Input, OnInit } from "@angular/core";
import { TreeBranch } from "../core";
import { EmptyComponent } from "./empty.component";

@Component({
   selector: "branch-growth",
   template: "This is a test"
})
export class BranchGrowthComponent implements OnInit {
   @Input() treeBranch?: TreeBranch<BranchGrowthComponent | EmptyComponent>;

   public ngOnInit(): void {
      if (this.treeBranch === undefined) {
         throw new Error("treeBranch is undefined");
      }
      this.treeBranch.grow(EmptyComponent);
      this.treeBranch.grow(EmptyComponent);
   }
}
