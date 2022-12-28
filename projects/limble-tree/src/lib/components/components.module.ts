import { NgModule } from "@angular/core";
import { BranchComponent } from "./branch/branch.component";
import { RootComponent } from "./root/root.component";

@NgModule({
   declarations: [RootComponent, BranchComponent],
   imports: [],
   providers: [],
   exports: [RootComponent, BranchComponent]
})
export class ComponentsModule {}
