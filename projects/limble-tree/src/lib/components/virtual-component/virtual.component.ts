import {
   ViewChild,
   ViewContainerRef,
   Component,
   ApplicationRef
} from "@angular/core";
import { NodeComponent } from "../node-component.interface";

@Component({
   selector: "N/A",
   template: "<div #container></div>"
})
export class VirtualComponent implements NodeComponent {
   @ViewChild("container", { read: ViewContainerRef })
   public branchesContainer: ViewContainerRef | undefined;

   public constructor(public readonly app: ApplicationRef) {}
}
