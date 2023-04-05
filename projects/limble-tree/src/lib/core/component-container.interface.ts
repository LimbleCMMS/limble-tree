import type { ViewContainerRef, ViewRef } from "@angular/core";

export interface ComponentContainer<Component> {
   detectChanges: () => void;
   getBranchesContainer: () => ViewContainerRef | undefined;
   getComponentInstance: () => Component;
   getHostView: () => ViewRef;
   getNativeElement: () => HTMLElement;
}
