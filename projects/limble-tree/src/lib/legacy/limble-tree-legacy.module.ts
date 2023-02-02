import { NgModule } from "@angular/core";
import { LegacyTree } from "./legacy-tree";
import { LimbleTreeRootComponent } from "./limble-tree-root/limble-tree-root.component";

/** @deprecated */
@NgModule({
   declarations: [],
   imports: [LimbleTreeRootComponent],
   providers: [LegacyTree],
   exports: [LimbleTreeRootComponent]
})
export class LimbleTreeLegacyModule {}
