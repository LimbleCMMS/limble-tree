import {
   ApplicationRef,
   Component,
   ComponentRef,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { NodeComponent } from "../components/node-component.interface";
import { TreeError } from "../errors";

@Component({
   selector: "N/A",
   template: "<div #container></div>"
})
export class VirtualComponent implements NodeComponent {
   @ViewChild("container", { read: ViewContainerRef })
   public branchesContainer: ViewContainerRef | undefined;
   public showInnerDropzone: boolean = false;

   public constructor(public readonly app: ApplicationRef) {}
}

function getVirtualComponent(): ComponentRef<VirtualComponent> {
   const fixture = TestBed.createComponent(VirtualComponent);
   fixture.detectChanges();
   return fixture.componentRef;
}

export function getViewContainer(): ViewContainerRef {
   const fixture = getVirtualComponent();
   const container = fixture.instance.branchesContainer;
   if (container === undefined) {
      throw new TreeError("container is not available");
   }
   return container;
}
