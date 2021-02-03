import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import type { Branch } from "../branch";

export type DragState = "idle" | "dragging" | "droppable" | "captured";

@Injectable()
export class DragStateService {
   /** pushes the new state whenever the state changes */
   public state$: BehaviorSubject<DragState>;

   /** holds the thing being dragged, if any */
   private _tempData: Branch<any> | undefined;

   /** the current state of the drag process */
   private state: DragState;

   constructor() {
      this.state = "idle";
      this.state$ = new BehaviorSubject<DragState>(this.state);
   }

   /** Called to indicate that something is being dragged. Stores that something for later. */
   public dragging(value: Branch<any>) {
      this._tempData = value;
      this.state = "dragging";
      this.state$.next(this.state);
   }

   /** Called to indicate that there is a valid active drop zone. Drop is now possible. */
   public droppable() {
      if (this.state !== "dragging") {
         throw new Error(
            "Can only move to `droppable` state from `dragging` state"
         );
      }
      this.state = "droppable";
      this.state$.next(this.state);
   }

   /** Called to indicate that there is no longer a valid active drop zone. Drop is no longer possible. */
   public notDroppable() {
      if (this.state !== "droppable") {
         throw new Error(
            "Can only call `notDroppable` when state is `droppable`"
         );
      }
      this.state = "dragging";
      this.state$.next(this.state);
   }

   /** Called to indicate that a drop into a valid drop zone has occurred. Returns the item that was dropped.  */
   public capture() {
      if (this.state !== "droppable") {
         throw new Error(
            "Can only move to `captured` state from `droppable` state"
         );
      }
      this.state = "captured";
      this.state$.next(this.state);
      return this._tempData;
   }

   /** Called to reset the service for future drags */
   public release() {
      this._tempData = undefined;
      this.state = "idle";
      this.state$.next(this.state);
   }

   /** gets the current thing being dragged, if any. */
   public getData() {
      return this._tempData;
   }

   /** gets the current state */
   public getState() {
      return this.state;
   }
}
