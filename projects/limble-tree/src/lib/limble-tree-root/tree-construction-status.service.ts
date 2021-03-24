import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class TreeConstructionStatus {
   private beingBuilt: number;
   private isReady: boolean;
   public readonly stable$: BehaviorSubject<boolean>;

   public constructor() {
      this.beingBuilt = 0;
      this.isReady = false;
      this.stable$ = new BehaviorSubject(this.treeIsStable());
   }

   public constructing(): void {
      this.beingBuilt++;
      this.emit();
   }

   public doneConstructing(): void {
      this.beingBuilt--;
      this.emit();
   }

   public treeIsStable(): boolean {
      return this.isReady === true && this.beingBuilt === 0;
   }

   public ready(val: boolean): void {
      this.isReady = val;
   }

   public emit(): void {
      this.stable$.next(this.treeIsStable());
   }
}
