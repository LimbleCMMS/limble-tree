import { assert } from "../../../shared/assert";
import { TreePlot } from "../../structure/tree-plot";
import { filter, Observable, Subject, Subscription } from "rxjs";
import { GraftEvent } from "../../events/graft-event";
import { PruneEvent } from "../../events/prune-event";
import { TreeEvent } from "../../events/tree-event.interface";
import { TreeNode } from "../../structure/tree-node.interface";
import { TreeBranchNode } from "../../structure/tree-branch/tree-branch-node.interface";
import { BranchOptions } from "../branch-options";
import { NodeRef } from "../../core/node-ref";
import { ComponentRef, Type, ViewContainerRef } from "@angular/core";
import { BranchComponent } from "../../components/branch/branch.component";
import { VirtualTreeRoot } from "../virtual-tree-root/virtual-tree-root";
import { Relationship } from "../relationship.interface";

export class TreeBranch<T>
   implements TreeBranchNode<NodeRef, TreeBranch<unknown>>
{
   private readonly _branches: Array<TreeBranch<unknown>>;
   private readonly events$: Subject<TreeEvent>;
   private _parent: TreeNode<TreeBranch<unknown>>;
   //FIXME: Unsubscribe
   private readonly subscriptions: Array<Subscription>;

   public constructor(private contents: NodeRef) {
      this._branches = [];
      this.events$ = new Subject();
      this._parent = new VirtualTreeRoot();
      this.dispatch(
         new GraftEvent(this, { parent: this._parent, child: this, index: 0 })
      );
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
      const parent = this.parent();
      parent.dispatch(event);
   }

   public events(): Observable<TreeEvent> {
      return this.events$;
   }

   public getBranch(index: number): TreeBranch<unknown> | undefined {
      return this._branches[index];
   }

   public getContents(): NodeRef {
      return this.contents;
   }

   public growBranch(options: BranchOptions<T>): TreeBranch<T> {
      const nodeRef = this.insertComponent(options.component);
      const branch = new TreeBranch<T>(nodeRef);
      this._branches.push(branch);
      return branch;
   }

   private getBranchesContainer(): ViewContainerRef {
      //FIXME: law of demeter?
      const container = this.getContents()?.instance?.branchesContainer;
      assert(container !== undefined);
      return container;
   }

   public graftTo(
      newParent: TreeNode<TreeBranch<unknown>>,
      index?: number
   ): number {
      this.dispatch(
         new PruneEvent(this, {
            parent: this._parent,
            child: this,
            index: this.index()
         })
      );
      this._parent = newParent;
      const newIndex = index ?? this.parent().branches().length;
      this.dispatch(
         new GraftEvent(this, {
            parent: this._parent,
            child: this,
            index: newIndex
         })
      );
      return newIndex;
   }

   public index(): number {
      const index = this.parent()
         .branches()
         .findIndex((branch) => branch === this);
      assert(index >= 0);
      return index;
   }

   private insertComponent(
      component: Type<T>
   ): ComponentRef<BranchComponent<T>> {
      const container = this.getBranchesContainer();
      const componentRef =
         container.createComponent<BranchComponent<T>>(BranchComponent);
      componentRef.instance.content = component;
      componentRef.changeDetectorRef.detectChanges();
      return componentRef;
   }

   public parent(): TreeNode<TreeBranch<unknown>> {
      return this._parent;
   }

   public plot(): TreePlot {
      return new Map(
         this.branches().map((branch, index) => [index, branch.plot()])
      );
   }

   public position(): Array<number> {
      if (this._parent instanceof TreeBranch) {
         const parentPosition = this._parent.position();
         return [...parentPosition, this.index()];
      }
      return [this.index()];
   }

   public prune(): void {
      this.dispatch(
         new PruneEvent(this, {
            parent: this._parent,
            child: this,
            index: this.index()
         })
      );
      this._parent = new VirtualTreeRoot();
      this.dispatch(
         new GraftEvent(this, { parent: this._parent, child: this, index: 0 })
      );
   }

   public setContents(contents: NodeRef): void {
      this.contents = contents;
   }

   public traverse(
      callback: (node: TreeNode<TreeBranch<unknown>>) => void
   ): void {
      callback(this);
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
         filter((event) => event.parent() === this)
      );
   }

   private prunesToSelf(): Observable<PruneEvent<Relationship>> {
      return this.events().pipe(
         filter(
            (event): event is PruneEvent<Relationship> =>
               event instanceof PruneEvent
         ),
         filter((event) => event.parent() === this)
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
