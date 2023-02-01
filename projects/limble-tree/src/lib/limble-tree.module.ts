import { NgModule } from "@angular/core";
import { BranchComponent } from "./components/branch/branch.component";
import { RootComponent } from "./components/root/root.component";
import { TreeService } from "./core/tree-service/tree.service";

@NgModule({
   declarations: [],
   imports: [RootComponent, BranchComponent],
   providers: [TreeService],
   exports: []
})
export class LimbleTreeModule {}
