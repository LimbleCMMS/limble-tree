import { Injectable, Type, ViewContainerRef, ViewRef } from "@angular/core";
import { LimbleTreeComponent } from "./limble-tree.component";
import { ComponentCreatorService } from "./componentCreator.service";
import { LimbleTreeNodeComponent } from "./limble-tree-node/limble-tree-node.component";

export interface LimbleTreeNode {
   nodes?: Array<LimbleTreeNode>;
   data: unknown;
   component?: ComponentObj;
}

export interface LimbleTreeData {
   nodes: Array<LimbleTreeNode>;
   options?: {
      defaultComponent?: ComponentObj;
   };
}

export interface ComponentObj {
   class: Type<unknown>;
   bindings?: {
      [index: string]: unknown;
   };
}

export interface TreeLocationObj {
   parentContainerRef: ViewContainerRef;
   viewRef: ViewRef;
}

export function getLocationIndex(location: TreeLocationObj) {
   return location.parentContainerRef.indexOf(location.viewRef);
}

@Injectable()
export class LimbleTreeService {
   constructor(
      private readonly componentCreatorService: ComponentCreatorService
   ) {}

   public render(host: ViewContainerRef, treeData: LimbleTreeData) {
      host.clear();
      const offset = 45;
      for (const node of treeData.nodes) {
         let component = node.component;
         if (component === undefined) {
            component = treeData.options?.defaultComponent;
         }
         if (component === undefined) {
            throw new Error("limbleTree requires a component to render");
         }
         const componentRef = this.componentCreatorService.appendComponent<LimbleTreeNodeComponent>(
            LimbleTreeNodeComponent,
            host
         );
         componentRef.instance.nodeData = node.data;
         componentRef.instance.component = component;
         componentRef.instance.location = {
            parentContainerRef: host,
            viewRef: componentRef.hostView
         };
         if (node.nodes && node.nodes.length > 0) {
            const newBranch = this.componentCreatorService.appendComponent<LimbleTreeComponent>(
               LimbleTreeComponent,
               host
            );
            newBranch.instance.treeData = {
               nodes: node.nodes,
               options: treeData.options
            };
            newBranch.instance.offset = offset;
         }
      }
   }
}
