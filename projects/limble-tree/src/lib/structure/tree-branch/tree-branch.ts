import { assert } from "../../../shared/assert";
import { TreePlot } from "../../../shared/tree-plot";
import { filter, Observable, Subject, Subscription } from "rxjs";
import { GraftEvent } from "../../events/graft-event";
import { PruneEvent } from "../../events/prune-event";
import { TreeEvent } from "../../events/tree-event";
import { TreeNode } from "../tree-node";
import { TreeRelationship } from "../tree-relationship/tree-relationship";
import { TreeRoot } from "../tree-root/tree-root";

export class TreeBranch<T = unknown> implements TreeNode<T> {
   private readonly childRelationships: Array<TreeRelationship<T>>;
   private readonly parentRelationship: TreeRelationship<T>;
   private readonly events$: Subject<TreeEvent<T>>;
   //FIXME: Unsubscribe
   private readonly subscriptions: Array<Subscription>;

   public constructor(private contents: T) {
      this.events$ = new Subject();
      this.childRelationships = [];
      this.parentRelationship = new TreeRelationship(new TreeRoot(), this);
      this.event(new GraftEvent(this.parentRelationship, 0));
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

   public getContents(): T {
      return this.contents;
   }

   public event(event: TreeEvent<T>): void {
      this.events$.next(event);
      const parent = this.parent();
      parent.event(event);
   }

   public events(): Observable<TreeEvent<T>> {
      return this.events$;
   }

   public graftTo(newParent: TreeNode<T>, index?: number): void {
      this.event(new PruneEvent(this.parentRelationship));
      this.parentRelationship.setParent(newParent);
      const newIndex = index ?? this.parent().branches().length;
      this.event(new GraftEvent(this.parentRelationship, newIndex));
   }

   public index(): number {
      const index = this.parent()
         .branches()
         .findIndex((branch) => branch === this);
      assert(index >= 0);
      return index;
   }

   public parent(): TreeNode<T> {
      return this.parentRelationship.getParent();
   }

   public plot(): TreePlot {
      return new Map(
         this.branches().map((branch, index) => [index, branch.plot()])
      );
   }

   public position(): Array<number> {
      const parentPosition = this.parent().position();
      return [...parentPosition, this.index()];
   }

   public prune(): TreeRoot<T> {
      this.event(new PruneEvent(this.parentRelationship));
      const newParent = new TreeRoot<T>();
      this.parentRelationship.setParent(newParent);
      this.event(new GraftEvent(this.parentRelationship, 0));
      return newParent;
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
