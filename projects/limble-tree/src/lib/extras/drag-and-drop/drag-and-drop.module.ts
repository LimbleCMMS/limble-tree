import { NgModule } from "@angular/core";
import { TreeDragAndDropService } from "./drag-and-drop.service";
import { DraggableDirective } from "./draggable.directive";

/**
 * An Angular module containing all of the entities which provide Drag-And-Drop
 * functionality.
 */
@NgModule({
   imports: [DraggableDirective],
   providers: [TreeDragAndDropService],
   exports: [DraggableDirective]
})
export class TreeDragAndDropModule {}
