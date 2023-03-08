import { NgModule } from "@angular/core";
import { TreeCollapseModule } from "./extras/collapse";
import { TreeDragAndDropModule } from "./extras/drag-and-drop";
import { TreeService } from "./core";
import { LimbleTreeLegacyModule } from "./legacy";

/**
 * Import this Angular module into your application to gain access to the
 * components, directives, and services provided by Limble Tree.
 */
@NgModule({
   declarations: [],
   imports: [LimbleTreeLegacyModule, TreeCollapseModule, TreeDragAndDropModule],
   providers: [TreeService],
   exports: [LimbleTreeLegacyModule, TreeCollapseModule, TreeDragAndDropModule]
})
export class LimbleTreeModule {}
