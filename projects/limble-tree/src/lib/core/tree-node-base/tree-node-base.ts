import { ComponentRef } from "@angular/core";
import { filter, Observable, Subject, Subscription } from "rxjs";
import { NodeComponent } from "../../components/node-component.interface";
import { GraftEvent } from "../../events/graft-event";
import { PruneEvent } from "../../events/prune-event";
import { TreeEvent } from "../../events/tree-event.interface";
import { ContainerTreeNode } from "../../structure/nodes/container-tree-node.interface";
import { TreePlot } from "../../structure/tree-plot";
import { Relationship } from "../relationship.interface";
import { TreeBranch } from "../tree-branch/tree-branch";

export class TreeNodeBase
   implements
      ContainerTreeNode<ComponentRef<NodeComponent>, TreeBranch<unknown>>
{
   private readonly _branches: Array<TreeBranch<unknown>>;
   private readonly events$: Subject<TreeEvent>;
   //FIXME: Unsubscribe
   private readonly subscriptions: Array<Subscription>;

   public constructor() {
      this._branches = [];
      this.events$ = new Subject();
      this.subscriptions = [
         this.graftsToSelf().subscribe((event) => {
            this.registerChildRelationship(event.child(), event.index());
         }),
         this.prunesToSelf().subscribe((event) => {
            this.deregisterChildRelationship(event.child());
         })
      ];
   }

   public branches(): Array<TreeBranch<unknown>> {
      return [...this._branches];
   }

   public deleteBranch(index?: number): void {
      if (index === undefined) {
         this._branches.pop();
         return;
      }
      this._branches.splice(index, 1);
   }

   public dispatch(event: TreeEvent): void {
      this.events$.next(event);
   }

   public events(): Observable<TreeEvent> {
      return this.events$;
   }

   public getBranch(index: number): TreeBranch<unknown> | undefined {
      return this._branches[index];
   }

   public getContents(): never {
      throw new Error("Not Implemented");
   }

   public plot(): TreePlot {
      return new Map(
         this.branches().map((branch, index) => [index, branch.plot()])
      );
   }

   public traverse(
      callback: (
         node: ContainerTreeNode<
            ComponentRef<NodeComponent>,
            TreeBranch<unknown>
         >
      ) => void
   ): void {
      this.branches().forEach((branch) => {
         branch.traverse(callback);
      });
   }

   private deregisterChildRelationship(child: TreeBranch<unknown>): void {
      const index = this.branches().findIndex((branch) => branch === child);
      this.deleteBranch(index);
   }

   private graftsToSelf(): Observable<GraftEvent<Relationship>> {
      return this.events().pipe(
         filter(
            (event): event is GraftEvent<Relationship> =>
               event instanceof GraftEvent
         ),
         filter((event) => event.parent().events() === this.events$)
      );
   }

   private prunesToSelf(): Observable<PruneEvent<Relationship>> {
      return this.events().pipe(
         filter(
            (event): event is PruneEvent<Relationship> =>
               event instanceof PruneEvent
         ),
         filter((event) => event.parent().events() === this.events$)
      );
   }

   private registerChildRelationship(
      child: TreeBranch<unknown>,
      index: number
   ): void {
      const branches = this.branches();
      if (index < 0 || index > branches.length) {
         throw new Error(
            `Can't register child at index ${index}. Out of range.`
         );
      }
      this._branches.splice(index, 0, child);
   }
}
