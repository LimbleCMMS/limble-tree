import { assert } from "../../../shared";
import { BehaviorSubject, type Observable } from "rxjs";
import { TreeBranch } from "../../core";

export enum DragStates {
   Idle = 0,
   Starting = 1,
   Dragging = 2,
   Dropped = 3
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

   public starting<T>(treeBranch: TreeBranch<T>): void {
      assert(this._state === DragStates.Idle);
      this.dragData = treeBranch;
      this.state$.next(DragStates.Starting);
   }

   public dragging(): void {
      assert(this._state === DragStates.Starting);
      this.state$.next(DragStates.Dragging);
   }

   public dropped(): void {
      assert(this._state === DragStates.Dragging);
      this.state$.next(DragStates.Dropped);
   }

   public restart(): void {
      this.dragData = undefined;
      this.state$.next(DragStates.Idle);
   }

   public events(): Observable<DragStates> {
      return this.state$;
   }

   public state(): DragStates {
      return this._state;
   }
}

export const dragState = new DragState();
