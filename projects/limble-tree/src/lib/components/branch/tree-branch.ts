import { assert } from "../../../shared/assert";
import { TreePlot } from "../../structure/tree-plot";
import { filter, Observable, Subject, Subscription } from "rxjs";
import { GraftEvent } from "../../events/graft-event";
import { PruneEvent } from "../../events/prune-event";
import { TreeEvent } from "../../events/tree-event.interface";
import { TreeNode } from "../../structure/tree-node.interface";
import { TreeBranchNode } from "../../structure/tree-branch/tree-branch-node.interface";
import { BranchOptions } from "../../core/branch-options";
import { NodeRef } from "../../core/node-ref";
import { BranchableBehavior } from "../../relationships/branchable/branches-container";
import { ComponentRef, Type, ViewContainerRef } from "@angular/core";
import { BranchComponent } from "../../public/branch/branch.component";
import { VirtualTreeRoot } from "../../core/virtual-tree-root/virtual-tree-root";

export class TreeBranch<T> implements TreeBranchNode<NodeRef> {
   private readonly branchesContainer: BranchableBehavior<
      TreeBranchNode<NodeRef>
   >;
   private _parent: TreeNode<NodeRef>;
   private readonly events$: Subject<TreeEvent<NodeRef>>;
   //FIXME: Unsubscribe
   private readonly subscriptions: Array<Subscription>;

   public constructor(private contents: NodeRef) {
      this.events$ = new Subject();
      this.branchesContainer = new BranchableBehavior();
      this._parent = new VirtualTreeRoot();
      this.event(
         new GraftEvent({ parent: this._parent, child: this, index: 0 })
      );
      this.subscriptions = [
         this.graftsToSelf().subscribe((event) => {
            this.registerChildRelationship(event.child, event.index);
         }),
         this.prunesToSelf().subscribe((event) => {
            this.deregisterChildRelationship(event.child);
         })
      ];
   }

   public branches(): Array<TreeBranchNode<NodeRef>> {
      return this.branchesContainer.branches();
   }

   public getContents(): NodeRef {
      return this.contents;
   }

   public growBranch(options: BranchOptions<T>): TreeBranchNode<NodeRef> {
      const nodeRef = this.insertComponent(options.component);
      const branch = new TreeBranch(nodeRef);
      this.branchesContainer.growBranch(branch);
      return branch;
   }

   public event(event: TreeEvent<NodeRef>): void {
      this.events$.next(event);
      const parent = this.parent();
      parent.event(event);
   }

   public events(): Observable<TreeEvent<NodeRef>> {
      return this.events$;
   }

   private getBranchesContainer(): ViewContainerRef {
      //FIXME: law of demeter?
      const container = this.getContents()?.instance?.branchesContainer;
      assert(container !== undefined);
      return container;
   }

   public graftTo(newParent: TreeNode<NodeRef>, index?: number): number {
      this.event(
         new PruneEvent({
            parent: this._parent,
            child: this,
            index: this.index()
         })
      );
      this._parent = newParent;
      const newIndex = index ?? this.parent().branches().length;
      this.event(
         new GraftEvent({ parent: this._parent, child: this, index: newIndex })
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

   public parent(): TreeNode<NodeRef> {
      return this._parent;
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

   public prune(): void {
      this.event(
         new PruneEvent({
            parent: this._parent,
            child: this,
            index: this.index()
         })
      );
      this._parent = new VirtualTreeRoot();
      this.event(
         new GraftEvent({ parent: this._parent, child: this, index: 0 })
      );
   }

   public setContents(contents: NodeRef): void {
      this.contents = contents;
   }

   public traverse(callback: (node: TreeNode<T>) => void): void {
      callback(this);
      this.branches().forEach((branch) => {
         branch.traverse(callback);
      });
   }

   private deregisterChildRelationship(child: TreeBranchNode<NodeRef>): void {
      const index = this.branchesContainer
         .branches()
         .findIndex((branch) => branch === child);
      this.branchesContainer.delete(index);
   }

   private graftsToSelf(): Observable<GraftEvent<NodeRef>> {
      return this.events().pipe(
         filter(
            (event): event is GraftEvent<NodeRef> => event instanceof GraftEvent
         ),
         filter((event) => event.parent === this)
      );
   }

   private prunesToSelf(): Observable<PruneEvent<NodeRef>> {
      return this.events().pipe(
         filter(
            (event): event is PruneEvent<NodeRef> => event instanceof PruneEvent
         ),
         filter((event) => event.parent === this)
      );
   }

   private registerChildRelationship(
      child: TreeBranchNode<NodeRef>,
      index: number
   ): void {
      const branches = this.branchesContainer.branches();
      if (index < 0 || index > branches.length) {
         throw new Error(
            `Can't register child at index ${index}. Out of range.`
         );
      }
      this.branchesContainer.growBranch(child, index);
   }
}
