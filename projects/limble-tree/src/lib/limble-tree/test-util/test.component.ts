import { Component } from "@angular/core";
import { BranchOptions } from "../tree-cursor/branch-options";

@Component({
   selector: "N/A",
   template: "This is a test"
})
export class TestComponent {}

export const branchOptions: BranchOptions<TestComponent> = {
   component: TestComponent
};
