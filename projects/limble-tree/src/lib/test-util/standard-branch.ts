import { createComponent } from "@angular/core";
import { VirtualComponent } from "../components/virtual-component/virtual.component";
import { TreeBranch } from "../core/tree-branch/tree-branch";
import { EmptyComponent } from "./empty.component";
import { getInjector } from "./virtual";

export function getStandardBranch(): TreeBranch<EmptyComponent> {
   const virtualComponent = createComponent(VirtualComponent, {
      environmentInjector: getInjector()
   });
   virtualComponent.changeDetectorRef.detectChanges();
   return new TreeBranch(EmptyComponent, virtualComponent);
}
