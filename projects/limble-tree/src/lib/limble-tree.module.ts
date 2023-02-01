import { NgModule } from "@angular/core";
import { BranchComponent } from "./components/branch/branch.component";
import { RootComponent } from "./components/root/root.component";
import { LegacyTreeService } from "./core/legacy/legacy-tree.service";
import { TreeService } from "./core/tree-service/tree.service";

@NgModule({
   declarations: [],
   imports: [RootComponent, BranchComponent],
   providers: [TreeService, LegacyTreeService],
   exports: []
})
export class LimbleTreeModule {}
