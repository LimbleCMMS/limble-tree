import { NgModule } from "@angular/core";
import { LimbleTreeRootComponent } from "./limble-tree-root/limble-tree-root.component";
import { LegacyTree } from "./legacy-tree";

/** @deprecated */
@NgModule({
   declarations: [],
   imports: [LimbleTreeRootComponent],
   providers: [LegacyTree],
   exports: [LimbleTreeRootComponent]
})
export class LimbleTreeLegacyModule {}
