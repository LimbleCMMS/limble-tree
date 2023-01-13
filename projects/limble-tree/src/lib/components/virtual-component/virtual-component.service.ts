import { ApplicationRef, ComponentRef, createComponent } from "@angular/core";
import { VirtualComponent } from "./virtual.component";

export class VirtualComponentService {
   private readonly virtualComponent: ComponentRef<VirtualComponent>;

   public constructor(private readonly app: ApplicationRef) {
      this.virtualComponent = createComponent(VirtualComponent, {
         environmentInjector: this.app.injector
      });
   }

   public getVirtualComponent(): ComponentRef<VirtualComponent> {
      return this.virtualComponent;
   }
}
