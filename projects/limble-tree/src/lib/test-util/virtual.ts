import {
   Component,
   ComponentRef,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { assert } from "../../shared/assert";
import { NodeComponent } from "../components/node-component.interface";

@Component({
   selector: "N/A",
   template: "<div #container></div>"
})
export class VirtualComponent implements NodeComponent {
   @ViewChild("container", { read: ViewContainerRef })
   public branchesContainer: ViewContainerRef | undefined;
   public showInnerDropzone: boolean = false;
}

function getVirtualComponent(): ComponentRef<VirtualComponent> {
   const fixture = TestBed.createComponent(VirtualComponent);
   fixture.detectChanges();
   return fixture.componentRef;
}

export function getViewContainer(): ViewContainerRef {
   const fixture = getVirtualComponent();
   const container = fixture.instance.branchesContainer;
   assert(container !== undefined);
   return container;
}
