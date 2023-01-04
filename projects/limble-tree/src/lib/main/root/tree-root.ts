import { TreePlot } from "../../../shared/tree-plot";
import { filter, Observable, Subject, Subscription } from "rxjs";
import { GraftEvent } from "../../events/graft-event";
import { PruneEvent } from "../../events/prune-event";
import { TreeEvent } from "../../events/tree-event.interface";
import { TreeNode } from "../../structure/tree-node.interface";
import { TreeRootNode } from "../../structure/tree-root/tree-root-node.interface";
import { TreeBranchNode } from "../../structure/tree-branch/tree-branch-node.interface";
import { BranchesContainer } from "../../structure/branchable/branches-container";
import { TreeBranch } from "../branch/tree-branch";
import { NodeRef } from "../node-ref";
import { BranchOptions } from "../branch-options";
import { assert } from "../../../shared/assert";
import { ComponentRef, Type, ViewContainerRef } from "@angular/core";
import { BranchComponent } from "../../components/branch/branch.component";
import { RootComponent } from "../../components/root/root.component";

export class TreeRoot implements TreeRootNode<NodeRef> {
   private readonly branchesContainer: BranchesContainer<
      TreeBranchNode<NodeRef>
   >;
   private readonly events$: Subject<TreeEvent<NodeRef>>;
   private readonly rootComponentRef: ComponentRef<RootComponent>;
   //FIXME: Unsubscribe
   private readonly subscriptions: Array<Subscription>;

   public constructor(viewContainerRef: ViewContainerRef) {
      this.events$ = new Subject();
      this.branchesContainer = new BranchesContainer();
      this.rootComponentRef = viewContainerRef.createComponent(RootComponent);
      this.rootComponentRef.changeDetectorRef.detectChanges();
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

   public event(event: TreeEvent<NodeRef>): void {
      this.events$.next(event);
   }

   public events(): Observable<TreeEvent<NodeRef>> {
      return this.events$;
   }

   public growBranch<T>(options: BranchOptions<T>): TreeBranchNode<NodeRef> {
      const nodeRef = this.insertComponent(options.component);
      const branch = new TreeBranch<T>(nodeRef);
      this.branchesContainer.growBranch(branch);
      return branch;
   }

   public plot(): TreePlot {
      return new Map(
         this.branches().map((branch, index) => [index, branch.plot()])
      );
   }

   public position(): Array<number> {
      return [];
   }

   public traverse(callback: (node: TreeNode<NodeRef>) => void): void {
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

   private getBranchesContainer(): ViewContainerRef {
      const container = this.rootComponentRef.instance?.branchesContainer;
      assert(container !== undefined);
      return container;
   }

   private insertComponent<T>(
      component: Type<T>
   ): ComponentRef<BranchComponent<T>> {
      const container = this.getBranchesContainer();
      const componentRef =
         container.createComponent<BranchComponent<T>>(BranchComponent);
      componentRef.instance.content = component;
      componentRef.changeDetectorRef.detectChanges();
      return componentRef;
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
