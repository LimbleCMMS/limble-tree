import { filter, type Observable, Subject, type Subscription } from "rxjs";
import { hasProperty } from "../../shared";
import { TreeError } from "../errors";
import { GraftEvent, PruneEvent, type TreeEvent } from "../events";
import { TreeBranch } from "./tree-branch";
import type { TreePlot } from "./tree-plot.interface";
import type { TreeNode } from "./tree-node.interface";

export class TreeNodeBase<UserlandComponent>
   implements Partial<TreeNode<UserlandComponent>>
{
   private readonly _branches: Array<TreeBranch<UserlandComponent>>;
   private readonly events$: Subject<TreeEvent<UserlandComponent>>;
   private destroyed: boolean = false;
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

   public branches(): Array<TreeBranch<UserlandComponent>> {
      return [...this._branches];
   }

   public destroy(): void {
      this.branches().forEach((branch) => {
         branch.destroy();
      });
      this.subscriptions.forEach((sub) => {
         sub.unsubscribe();
      });
      this.destroyed = true;
   }

   public dispatch(event: TreeEvent<UserlandComponent>): void {
      this.events$.next(event);
   }

   public events(): Observable<TreeEvent<UserlandComponent>> {
      return this.events$;
   }

   public getBranch(index: number): TreeBranch<UserlandComponent> | undefined {
      return this._branches[index];
   }

   public handleUserlandError(error: unknown): never {
      const message = hasProperty(error, "message")
         ? error.message
         : "Unknown error";
      throw new TreeError(`Failed to grow branch: ${message}`, {
         cause: error
      });
   }

   public isDestroyed(): boolean {
      return this.destroyed;
   }

   public plot(): TreePlot {
      return new Map(
         this.branches().map((branch, index) => [index, branch.plot()])
      );
   }

   public traverse(
      callback: (node: TreeBranch<UserlandComponent>) => void
   ): void {
      this.branches().forEach((branch) => {
         branch.traverse(callback);
      });
   }

   private deregisterChildRelationship(
      child: TreeBranch<UserlandComponent>
   ): void {
      const index = this.branches().findIndex((branch) => branch === child);
      this._branches.splice(index, 1);
   }

   private graftsToSelf(): Observable<GraftEvent<UserlandComponent>> {
      return this.events().pipe(
         filter(
            (event): event is GraftEvent<UserlandComponent> =>
               event instanceof GraftEvent
         ),
         filter((event) => event.parent().events() === this.events$)
      );
   }

   private prunesToSelf(): Observable<PruneEvent<UserlandComponent>> {
      return this.events().pipe(
         filter(
            (event): event is PruneEvent<UserlandComponent> =>
               event instanceof PruneEvent
         ),
         filter((event) => event.parent().events() === this.events$)
      );
   }

   private registerChildRelationship(
      child: TreeBranch<UserlandComponent>,
      index: number
   ): void {
      const branches = this.branches();
      if (index < 0 || index > branches.length) {
         throw new TreeError(
            `Can't register child at index ${index}. Out of range.`
         );
      }
      this._branches.splice(index, 0, child);
   }
}
