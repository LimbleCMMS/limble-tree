import { ComponentRef } from "@angular/core";
import { assert } from "../../../shared/assert";
import { Subject } from "rxjs";
import { NodeComponent } from "../../components/node-component.interface";
import { TreeBranch } from "../../core";
import { config } from "../../core/configuration/configuration";
import { TreeError } from "../../errors";
import { DragEndEvent } from "../../events/drag/drag-end-event";
import { DragStartEvent } from "../../events/drag/drag-start-event";
import { ContainerTreeNode } from "../../structure/container-tree-node.interface";
import { dragState, DragStates } from "./drag-state";

class DragAndDrop {
   public readonly dragAborted$ = new Subject<DragEvent>();

   public dragStart<T>(treeBranch: TreeBranch<T>, event: DragEvent): void {
      if (!this.draggingAllowed(treeBranch)) {
         event.preventDefault();
         return;
      }
      treeBranch.dispatch(new DragStartEvent(treeBranch));
      this.setDragEffects(treeBranch, event);
      this.watchForDragend(treeBranch, event);
      // We have to do a setTimeout because DOM changes are not allowed during a
      // dragstart event.
      setTimeout(() => {
         dragState.starting(treeBranch);
         treeBranch.prune();
         dragState.dragging();
      });
   }

   public drop<T>(
      parent: ContainerTreeNode<ComponentRef<NodeComponent>, TreeBranch<T>>,
      index: number
   ): void {
      const treeBranch = dragState.getDragData<T>();
      if (treeBranch === undefined) {
         throw new TreeError("Cannot get dragged branch");
      }
      treeBranch.graftTo(parent, index);
      (
         treeBranch.getContents().location.nativeElement as HTMLElement
      ).style.display = "block";
      dragState.dropped();
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

   private watchForDragend<T>(
      treeBranch: TreeBranch<T>,
      event: DragEvent
   ): void {
      const oldParent = treeBranch.parent();
      const index = treeBranch.index();
      if (oldParent === undefined || index === undefined) {
         throw new Error("branch must have a parent");
      }
      event.target?.addEventListener(
         "dragend",
         (dragend) => {
            if (dragState.state() !== DragStates.Dropped) {
               //The drag ended but a drop never occurred, so put the dragged branch back where it started.
               this.dragAborted$.next(dragend as DragEvent);
               this.drop(oldParent, index);
            }
            dragState.restart();
            const newParent = treeBranch.parent();
            assert(newParent !== undefined);
            treeBranch.dispatch(new DragEndEvent(treeBranch, newParent, index));
         },
         { once: true }
      );
   }

   private draggingAllowed<T>(treeBranch: TreeBranch<T>): boolean {
      const allowDragging =
         config.getConfig(treeBranch.root())?.allowDragging ??
         ((): true => true);
      return allowDragging(treeBranch);
   }
}

export const dragAndDrop = new DragAndDrop();
