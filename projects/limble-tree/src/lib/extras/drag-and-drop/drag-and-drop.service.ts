import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TreeBranch } from "../../core";
import { dragState, DragStates } from "./drag-state";

@Injectable()
export class TreeDragAndDropService {
   public dragStart<T>(treeBranch: TreeBranch<T>, event: DragEvent): void {
      dragState.dragging(treeBranch);
      this.setDragEffects(treeBranch, event);
      // We have to do a setTimeout because the element has to exist for a split second
      // after dragstart fires.
      setTimeout(() => {
         treeBranch.prune();
      });
   }

   public state(): Observable<DragStates> {
      return dragState.events();
   }

   private getDragImageOffsets(
      event: DragEvent,
      element: Element
   ): [number, number] {
      const bounds = element.getBoundingClientRect();
      const xOffset = event.clientX - bounds.left;
      const yOffset = event.clientY - bounds.top;
      return [xOffset, yOffset];
   }

   private setDragEffects<T>(
      treeBranch: TreeBranch<T>,
      event: DragEvent
   ): void {
      const dataTransfer = event.dataTransfer;
      if (!(dataTransfer instanceof DataTransfer)) {
         throw new Error("bad drag event");
      }
      const nativeElement = treeBranch.getContents().location.nativeElement;
      const [xOffset, yOffset] = this.getDragImageOffsets(event, nativeElement);
      dataTransfer.setDragImage(nativeElement, xOffset, yOffset);
   }
}
