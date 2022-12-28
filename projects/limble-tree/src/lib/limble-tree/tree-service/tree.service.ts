import { Injectable, ViewContainerRef } from "@angular/core";
import { RootComponent } from "../../components/root/root.component";
import { TreeRoot } from "../../structure/tree-root/tree-root";
import { NodeRef } from "../node-ref";
import { Tree } from "../tree/tree";

@Injectable({ providedIn: "root" })
export class TreeService {
   public createTree(container: ViewContainerRef): Tree {
      container.clear();
      const componentRef = container.createComponent(RootComponent);
      componentRef.changeDetectorRef.detectChanges();
      const root = new TreeRoot<NodeRef>(componentRef);
      const newTree = new Tree(root);
      return newTree;
   }
}
