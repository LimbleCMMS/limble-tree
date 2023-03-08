import {
   Directive,
   ElementRef,
   HostListener,
   Input,
   Renderer2
} from "@angular/core";
import type { TreeBranch } from "../../core";
import { dragAndDrop } from "./drag-and-drop";

/** Makes an TreeBranch draggable when the host element is dragged */
@Directive({
   selector: "[limbleTreeDraggable]",
   standalone: true
})
export class DraggableDirective {
   @Input() limbleTreeDraggable?: TreeBranch<any> | undefined;

   public constructor(
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
      dragAndDrop.dragStart(this.limbleTreeDraggable, event);
   }
}
