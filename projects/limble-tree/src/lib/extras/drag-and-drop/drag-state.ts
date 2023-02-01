import { assert } from "../../../shared/assert";
import { BehaviorSubject, Observable } from "rxjs";
import { TreeBranch } from "../../core";
import { dropzoneRenderer } from "../../core/dropzone-renderer/dropzone-renderer";

export enum DragStates {
   Idle = 0,
   Dragging = 1
}

class DragState {
   private dragData: TreeBranch<any> | undefined;
   private _state: DragStates = DragStates.Idle;
   private readonly state$: BehaviorSubject<DragStates>;

   public constructor() {
      this.state$ = new BehaviorSubject<DragStates>(DragStates.Idle);
      this.state$.subscribe((state) => {
         this._state = state;
      });
      this.dragData = undefined;
   }

   public getDragData<T>(): TreeBranch<T> | undefined {
      return this.dragData;
   }

   public dragging<T>(treeBranch: TreeBranch<T>): void {
      assert(this._state === DragStates.Idle);
      this.dragData = treeBranch;
      this.state$.next(DragStates.Dragging);
   }

   public dropped(): void {
      assert(this._state === DragStates.Dragging);
      this.dragData = undefined;
      dropzoneRenderer.clearCurrentDisplay();
      this.state$.next(DragStates.Idle);
   }

   public events(): Observable<DragStates> {
      return this.state$;
   }
}

export const dragState = new DragState();
