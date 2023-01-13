import {
   ComponentRef,
   EnvironmentInjector,
   ViewContainerRef
} from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { VirtualComponent } from "../components/virtual-component/virtual.component";

export function getVirtualComponent(): ComponentRef<VirtualComponent> {
   const fixture = TestBed.createComponent(VirtualComponent);
   fixture.detectChanges();
   return fixture.componentRef;
}

export function getViewContainer(): ViewContainerRef {
   const fixture = getVirtualComponent();
   const container = fixture.instance.branchesContainer;
   if (container === undefined) {
      throw new Error("container is not available");
   }
   return container;
}

export function getInjector(): EnvironmentInjector {
   return getVirtualComponent().instance.app.injector;
}
