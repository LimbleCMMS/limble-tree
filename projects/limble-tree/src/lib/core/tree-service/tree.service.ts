import { Injectable, ViewContainerRef } from "@angular/core";
import { TreeRoot } from "../tree-root/tree-root";

@Injectable({ providedIn: "root" })
export class TreeService {
   public createEmptyTree<Component>(
      container: ViewContainerRef
   ): TreeRoot<Component> {
      container.clear();
      return new TreeRoot<Component>(container);
   }

   // public createTreeFromArray<Component>(
   //    container: ViewContainerRef
   // ): TreeRoot<Component> {
   //    //FIXME
   //    return new TreeRoot<Component>(container);
   // }
}
