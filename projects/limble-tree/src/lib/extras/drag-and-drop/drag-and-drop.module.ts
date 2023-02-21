import { NgModule } from "@angular/core";
import { TreeDragAndDropService } from "./drag-and-drop.service";
import { DraggableDirective } from "./draggable.directive";
import { DragoverNoChangeDetectDirective } from "./dragover-no-change-detect";

@NgModule({
   imports: [DraggableDirective, DragoverNoChangeDetectDirective],
   providers: [TreeDragAndDropService],
   exports: [DraggableDirective, DragoverNoChangeDetectDirective]
})
export class TreeDragAndDropModule {}
