import { Injectable, Type, ViewContainerRef } from "@angular/core";
import { LimbleTreeComponent } from "./limble-tree.component";
import { NodeInserterService } from "./nodeInserter.service";

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

@Injectable()
export class LimbleTreeService {
   constructor(private readonly nodeInserterService: NodeInserterService) {}

   public render(host: ViewContainerRef, treeData: LimbleTreeData) {
      let offset = 0;
      for (const node of treeData.nodes) {
         let component = node.component;
         if (component === undefined) {
            component = treeData.options?.defaultComponent;
         }
         if (component === undefined) {
            throw new Error("limbleTree requires a component to render");
         }
         const componentRef = this.nodeInserterService.appendComponent<any>(
            component.class,
            host
         );
         componentRef.instance.nodeData = node.data;
         for (const binding in component.bindings) {
            componentRef.instance[binding] = component.bindings[binding];
         }
         const newBranch = this.nodeInserterService.appendComponent<LimbleTreeComponent>(
            LimbleTreeComponent,
            host
         );
         newBranch.instance.treeData = {
            nodes: node.nodes ?? [],
            options: treeData.options
         };
         offset += 30;
         newBranch.instance.offset = offset;
      }
   }
}
