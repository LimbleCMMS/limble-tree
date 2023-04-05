import type { ComponentRef, ViewContainerRef, ViewRef } from "@angular/core";
import { assert } from "../../../shared";
import { type Subscription } from "rxjs";
import { RootComponent } from "../../components";
import { dropzoneRenderer } from "../../extras/drag-and-drop";
import { TreeRoot } from "./tree-root";
import type { ComponentContainer } from "../component-container.interface";

/**
 * A wrapper around the BranchComponent that helps instantiate it and handles its events.
 */
export class RootController<T> implements ComponentContainer<RootComponent> {
   private readonly rootComponentRef: ComponentRef<RootComponent>;
   private readonly instanceSubscriptions: Array<Subscription>;

   public constructor(
      private readonly treeRoot: TreeRoot<T>,
      viewContainerRef: ViewContainerRef
   ) {
      this.rootComponentRef = viewContainerRef.createComponent(RootComponent);
      const viewInitSub =
         this.rootComponentRef.instance.afterViewInit.subscribe(() => {
            const dropzone = this.rootComponentRef.instance.dropzone;
            assert(dropzone !== undefined);
            dropzoneRenderer.registerDropzone(dropzone, this.treeRoot);
         });
      const droppedSub = this.rootComponentRef.instance.dropped.subscribe(
         () => {
            dropzoneRenderer.handleDrop(this.treeRoot, "inner");
         }
      );
      this.instanceSubscriptions = [viewInitSub, droppedSub];
   }

   public destroy(): void {
      this.instanceSubscriptions.forEach((sub) => {
         sub.unsubscribe();
      });
   }

   public detectChanges(): void {
      this.rootComponentRef.changeDetectorRef.detectChanges();
   }

   public getBranchesContainer(): ViewContainerRef | undefined {
      return this.rootComponentRef.instance.branchesContainer;
   }

   public getComponentInstance(): RootComponent {
      return this.rootComponentRef.instance;
   }

   public getHostView(): ViewRef {
      return this.rootComponentRef.hostView;
   }

   public getNativeElement(): HTMLElement {
      return this.rootComponentRef.location.nativeElement;
   }
}
