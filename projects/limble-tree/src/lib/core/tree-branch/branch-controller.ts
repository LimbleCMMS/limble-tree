import {
   type ComponentRef,
   createComponent,
   EnvironmentInjector,
   type ViewContainerRef,
   type ViewRef
} from "@angular/core";
import { assert } from "../../../shared";
import { filter, type Subscription } from "rxjs";
import { BranchComponent } from "../../components";
import { dropzoneRenderer } from "../../extras/drag-and-drop";
import type { ComponentContainer } from "../component-container.interface";
import type { TreeBranch } from "./tree-branch";

/**
 * A wrapper around the BranchComponent that helps instantiate it and handles its events.
 */
export class BranchController<UserlandComponent>
   implements ComponentContainer<BranchComponent<UserlandComponent>>
{
   private readonly branchComponentRef: ComponentRef<
      BranchComponent<UserlandComponent>
   >;
   private readonly instanceSubscriptions: Array<Subscription>;
   private readonly outputBindingSubscriptions: Array<Subscription>;

   public constructor(
      private readonly treeBranch: TreeBranch<UserlandComponent>,
      parentBranchesContainer: ViewContainerRef
   ) {
      this.outputBindingSubscriptions = [];
      this.branchComponentRef = createComponent<
         BranchComponent<UserlandComponent>
      >(BranchComponent, {
         environmentInjector:
            parentBranchesContainer.injector.get(EnvironmentInjector)
      });
      this.branchComponentRef.instance.contentToHost =
         this.treeBranch.branchOptions.component;
      this.instanceSubscriptions = this.getInstanceSubscriptions(
         this.branchComponentRef.instance
      );
   }

   public destroy(): void {
      this.instanceSubscriptions.forEach((sub) => {
         sub.unsubscribe();
      });
      this.outputBindingSubscriptions.forEach((sub) => {
         sub.unsubscribe();
      });
   }

   public detectChanges(): void {
      this.branchComponentRef.changeDetectorRef.detectChanges();
   }

   public getBranchesContainer(): ViewContainerRef | undefined {
      return this.branchComponentRef.instance.branchesContainer;
   }

   public getComponentInstance(): BranchComponent<UserlandComponent> {
      return this.branchComponentRef.instance;
   }

   public getHostView(): ViewRef {
      return this.branchComponentRef.hostView;
   }

   public getNativeElement(): HTMLElement {
      return this.branchComponentRef.location.nativeElement;
   }

   public getUserlandComponentRef():
      | ComponentRef<UserlandComponent>
      | undefined {
      return this.branchComponentRef.instance.getHostedContent();
   }

   private getContentCreatedSub(
      instance: BranchComponent<UserlandComponent>
   ): Subscription {
      return instance.contentCreated.subscribe((userlandComponentInstance) => {
         const component = userlandComponentInstance as any;
         Object.entries(
            this.treeBranch.branchOptions.inputBindings ?? {}
         ).forEach(([key, value]) => {
            component[key] = value;
         });
         Object.entries(
            this.treeBranch.branchOptions.outputBindings ?? {}
         ).forEach(([key, value]) => {
            this.outputBindingSubscriptions.push(
               component[key].subscribe(value)
            );
         });
         component.treeBranch = this.treeBranch;
         const dropzones = instance.dropzones;
         assert(dropzones !== undefined);
         dropzoneRenderer.registerDropzones(dropzones, this.treeBranch);
      });
   }

   private getInstanceSubscriptions(
      instance: BranchComponent<UserlandComponent>
   ): Array<Subscription> {
      const droppedSub = instance.dropped.subscribe((placement) => {
         dropzoneRenderer.handleDrop(this.treeBranch, placement);
      });
      return [
         this.getContentCreatedSub(instance),
         this.getShowLowerZonesSub(instance),
         this.getShowUpperZonesSub(instance),
         droppedSub
      ];
   }

   private getShowLowerZonesSub(
      instance: BranchComponent<UserlandComponent>
   ): Subscription {
      return instance.showDropzones
         .pipe(filter((direction) => direction === "lower"))
         .subscribe(() => {
            const currentDropzoneDisplayed =
               dropzoneRenderer.getCurrentDisplay();
            if (
               currentDropzoneDisplayed?.treeBranch === this.treeBranch &&
               currentDropzoneDisplayed.direction === "lower"
            ) {
               return;
            }
            dropzoneRenderer.showLowerZones(this.treeBranch);
            instance.triggerChangeDetection();
         });
   }

   private getShowUpperZonesSub(
      instance: BranchComponent<UserlandComponent>
   ): Subscription {
      return instance.showDropzones
         .pipe(filter((direction) => direction === "upper"))
         .subscribe(() => {
            const currentDropzoneDisplayed =
               dropzoneRenderer.getCurrentDisplay();
            if (
               currentDropzoneDisplayed?.treeBranch === this.treeBranch &&
               currentDropzoneDisplayed.direction === "upper"
            ) {
               return;
            }
            dropzoneRenderer.showUpperZones(this.treeBranch);
            instance.triggerChangeDetection();
         });
   }
}
