import { Injectable, Type, ViewContainerRef } from "@angular/core";
import { ComponentCreatorService } from "./componentCreator.service";
import { LimbleTreeNodeComponent } from "./limble-tree-node/limble-tree-node.component";

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
export class LimbleTreeService {
   private treeData: LimbleTreeData | undefined;
   private host: ViewContainerRef | undefined;

   constructor(
      private readonly componentCreatorService: ComponentCreatorService
   ) {}

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
      this.render(this.host, this.treeData, []);
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

   public move(
      sourceCoordinates: Array<number>,
      targetCoordinates: Array<number>
   ) {
      const sourceGroup = this.getCoordinatesGroup(sourceCoordinates);
      const sourceIndex = sourceCoordinates[sourceCoordinates.length - 1];
      const sourceNode = sourceGroup[sourceIndex];
      const targetGroup = this.getCoordinatesGroup(targetCoordinates);
      const targetIndex = targetCoordinates[targetCoordinates.length - 1];
      if (sourceGroup === targetGroup && sourceIndex < targetIndex) {
         //The node is moving down in its current branch, so we have to insert before we delete.
         this.insertNodeIntoGroup(sourceNode, targetGroup, targetIndex);
         this.removeNodeFromGroup(sourceNode, sourceGroup);
      } else {
         //The node is either:
         //(1) leaving its current branch, so we can do the insert and delete in any order; or
         //(2) moving up its current branch, so we have to delete first before inserting.
         this.removeNodeFromGroup(sourceNode, sourceGroup);
         this.insertNodeIntoGroup(sourceNode, targetGroup, targetIndex);
      }
      this.renderRoot();
   }

   public getTreeData(): LimbleTreeData {
      if (this.treeData === undefined) {
         throw new Error("could not get tree data");
      }
      return this.treeData;
   }

   private removeNodeFromGroup(
      node: LimbleTreeNode,
      nodeGroup: Array<LimbleTreeNode>
   ) {
      nodeGroup.splice(nodeGroup.indexOf(node), 1);
   }

   private insertNodeIntoGroup(
      node: LimbleTreeNode,
      nodeGroup: Array<LimbleTreeNode>,
      index: number
   ) {
      nodeGroup.splice(index, 0, node);
   }

   private getCoordinatesGroup(coordinates: Array<number>) {
      if (this.treeData === undefined) {
         throw new Error("treeData is not defined");
      }
      let group = this.treeData.nodes;
      for (const [index, key] of coordinates.entries()) {
         if (index === coordinates.length - 1) {
            break;
         }
         const newGroup = group[key].nodes;
         if (newGroup === undefined) {
            throw new Error("bad coordinates");
         }
         group = newGroup;
      }
      return group;
   }
}
