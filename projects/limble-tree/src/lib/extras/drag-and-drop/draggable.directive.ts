import {
   Directive,
   ElementRef,
   HostListener,
   Input,
   Renderer2
} from "@angular/core";
import { TreeBranch } from "../../core";
import { TreeDragAndDropService } from "./drag-and-drop.service";

@Directive({
   selector: "[limbleTreeDraggable]",
   standalone: true
})
export class DraggableDirective {
   @Input() limbleTreeDraggable?: TreeBranch<any> | undefined;

   public constructor(
      private readonly dragAndDropService: TreeDragAndDropService,
      renderer: Renderer2,
      hostElement: ElementRef<HTMLElement>
   ) {
      renderer.setAttribute(hostElement.nativeElement, "draggable", "true");
      renderer.setStyle(hostElement.nativeElement, "cursor", "grab");
   }

   @HostListener("dragstart", ["$event"]) public onDragstart(
      event: DragEvent
   ): void {
      if (this.limbleTreeDraggable === undefined) return;
      this.dragAndDropService.dragStart(this.limbleTreeDraggable, event);
   }
}
