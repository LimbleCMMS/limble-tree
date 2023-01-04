import { Injectable, ViewContainerRef } from "@angular/core";
import { TreeRoot } from "../../main/root/tree-root";

@Injectable({ providedIn: "root" })
export class TreeService {
   public createTree(container: ViewContainerRef): TreeRoot {
      container.clear();
      return new TreeRoot(container);
   }
}
