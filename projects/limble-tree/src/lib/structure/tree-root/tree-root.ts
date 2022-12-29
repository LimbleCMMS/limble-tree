import { TreePlot } from "projects/limble-tree/src/shared/tree-plot";
import { filter, Observable, Subject, Subscription } from "rxjs";
import { GraftEvent } from "../../events/graft-event";
import { PruneEvent } from "../../events/prune-event";
import { TreeEvent } from "../../events/tree-event";
import { TreeBranch } from "../tree-branch/tree-branch";
import { TreeNode } from "../tree-node";
import { TreeRelationship } from "../tree-relationship/tree-relationship";

export class TreeRoot<T> implements TreeNode<T> {
   private readonly childRelationships: Array<TreeRelationship<T>>;
   private readonly events$: Subject<TreeEvent<T>>;
   //FIXME: Unsubscribe
   private readonly subscriptions: Array<Subscription>;

   public constructor(private contents?: T) {
      this.events$ = new Subject();
      this.childRelationships = [];
      this.subscriptions = [
         this.graftsToSelf().subscribe((event) => {
            this.registerChildRelationship(event.newRelationship, event.index);
         }),
         this.prunesToSelf().subscribe((event) => {
            this.deregisterChildRelationship(event.oldRelationship);
         })
      ];
   }

   public branches(): Array<TreeBranch<T>> {
      return this.childRelationships.map((rel) => rel.getChild());
   }

   public event(event: TreeEvent<T>): void {
      this.events$.next(event);
   }

   public events(): Observable<TreeEvent<T>> {
      return this.events$;
   }

   public getContents(): T | undefined {
      return this.contents;
   }

   public plot(): TreePlot {
      return new Map(
         this.branches().map((branch, index) => [index, branch.plot()])
      );
   }

   public position(): Array<number> {
      return [];
   }

   public setContents(contents: T): void {
      this.contents = contents;
   }

   public traverse(callback: (node: TreeNode<T>) => void): void {
      callback(this);
      this.branches().forEach((branch) => {
         branch.traverse(callback);
      });
   }

   private deregisterChildRelationship(
      relationship: TreeRelationship<T>
   ): void {
      const index = this.childRelationships.findIndex(
         (rel) => rel === relationship
      );
      this.childRelationships.splice(index, 1);
   }

   private graftsToSelf(): Observable<GraftEvent<T>> {
      return this.events().pipe(
         filter((event): event is GraftEvent<T> => event instanceof GraftEvent),
         filter((event) => event.newRelationship.getParent() === this)
      );
   }

   private prunesToSelf(): Observable<PruneEvent<T>> {
      return this.events().pipe(
         filter((event): event is PruneEvent<T> => event instanceof PruneEvent),
         filter((event) => event.oldRelationship.getParent() === this)
      );
   }

   private registerChildRelationship(
      relationship: TreeRelationship<T>,
      index: number
   ): void {
      if (index < 0 || index > this.childRelationships.length) {
         throw new Error(
            `Can't register child at index ${index}. Out of range.`
         );
      }
      this.childRelationships.splice(index, 0, relationship);
   }
}
