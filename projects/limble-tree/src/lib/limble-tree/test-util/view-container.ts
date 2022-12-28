import { ViewChild, ViewContainerRef, Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

@Component({
   selector: "N/A",
   template: "<div #container></div>"
})
class ComponentWithViewContainer {
   @ViewChild("container", { read: ViewContainerRef }) public viewContainerRef:
      | ViewContainerRef
      | undefined;
}

export function getViewContainer(): ViewContainerRef {
   TestBed.configureTestingModule({
      declarations: [ComponentWithViewContainer]
   });
   const fixture = TestBed.createComponent(ComponentWithViewContainer);
   fixture.detectChanges();
   const container = fixture.componentInstance.viewContainerRef;
   if (container === undefined) {
      throw new Error("container is not available");
   }
   return container;
}
