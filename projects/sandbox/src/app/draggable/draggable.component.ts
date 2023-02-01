import { Component, Input } from "@angular/core";
import { TreeBranch, TreeDragAndDropService } from "@limble/limble-tree";

@Component({
   selector: "draggable",
   templateUrl: "./draggable.component.html",
   styleUrls: ["./draggable.component.scss"]
})
export class DraggableComponent {
   @Input() treeBranch?: TreeBranch<DraggableComponent>;

   public constructor(private readonly dragService: TreeDragAndDropService) {}

   protected dragStart(event: DragEvent): void {
      if (this.treeBranch === undefined) return;
      this.dragService.dragStart(this.treeBranch, event);
   }
}
