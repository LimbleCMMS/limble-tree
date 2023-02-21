import { NgModule } from "@angular/core";
import { TreeCollapseModule } from "./extras/collapse";
import {
   DragoverNoChangeDetectDirective,
   TreeDragAndDropModule
} from "./extras/drag-and-drop";
import { TreeService } from "./core/tree-service/tree.service";
import { LimbleTreeLegacyModule } from "./legacy";
import { DraggableDirective } from "./extras/drag-and-drop/draggable.directive";

@NgModule({
   declarations: [],
   imports: [
      LimbleTreeLegacyModule,
      TreeCollapseModule,
      TreeDragAndDropModule,
      DraggableDirective,
      DragoverNoChangeDetectDirective
   ],
   providers: [TreeService],
   exports: [
      LimbleTreeLegacyModule,
      TreeCollapseModule,
      TreeDragAndDropModule,
      DraggableDirective,
      DragoverNoChangeDetectDirective
   ]
})
export class LimbleTreeModule {}
