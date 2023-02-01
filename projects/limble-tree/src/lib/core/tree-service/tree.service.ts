import { Injectable, ViewContainerRef } from "@angular/core";
import { config } from "../configuration/configuration";
import { TreeOptions } from "../configuration/tree-options.interface";
import { TreeRoot } from "../tree-root/tree-root";

@Injectable({ providedIn: "root" })
export class TreeService {
   public createEmptyTree<Component>(
      container: ViewContainerRef,
      options: TreeOptions = {}
   ): TreeRoot<Component> {
      container.clear();
      const root = new TreeRoot<Component>(container);
      config.setConfig(root, options);
      return root;
   }
}
