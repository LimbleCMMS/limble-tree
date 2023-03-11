import { Injectable, type ViewContainerRef } from "@angular/core";
import { config } from "../configuration/configuration";
import type { TreeOptions } from "../configuration/tree-options.interface";
import { TreeRoot } from "../tree-root/tree-root";

/** Responsible for the creation of new trees. */
@Injectable({ providedIn: "root" })
export class TreeService {
   /**
    * Creates a new, empty tree structure inside the provided container.
    *
    * @returns A `TreeRoot` representing the base of the new tree.
    */
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
