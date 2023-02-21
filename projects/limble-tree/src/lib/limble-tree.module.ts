import { NgModule } from "@angular/core";
import { TreeCollapseModule } from "./extras/collapse";
import { TreeDragAndDropModule } from "./extras/drag-and-drop";
import { TreeService } from "./core/tree-service/tree.service";
import { LimbleTreeLegacyModule } from "./legacy";

@NgModule({
   declarations: [],
   imports: [LimbleTreeLegacyModule, TreeCollapseModule, TreeDragAndDropModule],
   providers: [TreeService],
   exports: [LimbleTreeLegacyModule, TreeCollapseModule, TreeDragAndDropModule]
})
export class LimbleTreeModule {}
