import { NgModule } from "@angular/core";
import { BranchComponent } from "./components/branch/branch.component";
import { RootComponent } from "./components/root/root.component";
import { LimbleTreeRootComponent } from "./core";
import { LegacyTree } from "./core/legacy/legacy-tree";
import { TreeService } from "./core/tree-service/tree.service";

@NgModule({
   declarations: [],
   imports: [RootComponent, BranchComponent, LimbleTreeRootComponent],
   providers: [TreeService, LegacyTree],
   exports: []
})
export class LimbleTreeModule {}
