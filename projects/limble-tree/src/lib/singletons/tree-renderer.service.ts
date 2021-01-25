import { Injectable, Type, ViewContainerRef } from "@angular/core";
import { ComponentCreatorService } from "./component-creator.service";
import { LimbleTreeNodeComponent } from "../limble-tree-node/limble-tree-node.component";
import { DropZoneService } from "./drop-zone.service";
import { BehaviorSubject } from "rxjs";

export interface LimbleTreeNode {
   nodes?: Array<LimbleTreeNode>;
   data: unknown;
   component?: ComponentObj;
}

export interface LimbleTreeData {
   nodes: Array<LimbleTreeNode>;
   options?: LimbleTreeOptions;
}

export interface LimbleTreeOptions {
   defaultComponent?: ComponentObj;
   indent?: number;
}

export interface ComponentObj {
   class: Type<unknown>;
   bindings?: {
      [index: string]: unknown;
   };
}

export const INDENT = 45;

@Injectable({
   providedIn: "root"
})
export class TreeRendererService {
   private treeData: LimbleTreeData | undefined;
   private host: ViewContainerRef | undefined;
   public changes$: BehaviorSubject<null>;

   constructor(
      private readonly componentCreatorService: ComponentCreatorService,
      private readonly dropZoneService: DropZoneService
   ) {
      this.changes$ = new BehaviorSubject(null);
   }

   public renderRoot(host?: ViewContainerRef, treeData?: LimbleTreeData) {
      if (host !== undefined) {
         this.host = host;
      }
      if (treeData !== undefined) {
         this.treeData = treeData;
      }
      if (this.host === undefined || this.treeData === undefined) {
         throw new Error("not enough data to render root");
      }
      this.dropZoneService.clearDropZones();
      this.render(this.host, this.treeData, []);
      this.changes$.next(null);
   }

   public render(
      host: ViewContainerRef,
      treeData: LimbleTreeData,
      coordinates: Array<number>
   ) {
      if (host === undefined || treeData === undefined) {
         throw new Error("not enough data to render");
      }
      host.clear();
      if (treeData.options === undefined) {
         treeData.options = {};
      }
      if (treeData.options.indent === undefined) {
         treeData.options.indent = INDENT;
      }
      for (const [index, node] of treeData.nodes.entries()) {
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
         componentRef.instance.childNodes = node.nodes;
         componentRef.instance.component = component;
         const newCoordinates = [...coordinates];
         newCoordinates.push(index);
         componentRef.instance.coordinates = newCoordinates;
      }
   }

   public getTreeData(): LimbleTreeData {
      if (this.treeData === undefined) {
         throw new Error("could not get tree data");
      }
      return this.treeData;
   }
}
