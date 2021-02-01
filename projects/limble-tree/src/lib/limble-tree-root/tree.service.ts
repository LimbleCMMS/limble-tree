import { Injectable, Type, ViewContainerRef } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ComponentCreatorService } from "../singletons/component-creator.service";
import { DropZoneService } from "../singletons/drop-zone.service";
import { Branch, BranchCoordinates } from "../branch";
import { LimbleTreeNodeComponent } from "../limble-tree-node/limble-tree-node.component";

/** An object describing a node of the tree */
export interface LimbleTreeNode {
   /** A list of nodes to be rendered "under" this one, one level deeper in the tree. */
   nodes?: LimbleTreeData;
   // /** A custom data object that will be passed into the component as an `Input()` binding called `nodeData` */
   // data: unknown;
   /** An object that describes the component which will represent this node in the visual tree */
   component?: ComponentObj;
   collapsed?: boolean;
   [index: string]: unknown;
}

/** An object that the limble-tree-root component uses to build the tree */
export type LimbleTreeData = Array<LimbleTreeNode>;

/** A group of settings for changing the functionality of the tree */
export interface LimbleTreeOptions {
   /** The component object to use if one is not specified for a particular node */
   defaultComponent?: ComponentObj;
   /** The number of pixels to indent each level of the tree. Defaults to 45 */
   indent?: number;
   /** Whether to allow "nesting" (placing a node one level deeper than currently exists on the branch)
    * when dragging a node. Defaults to true.
    */
   allowNesting?: boolean | ((nodeData: LimbleTreeNode) => boolean);
   /** Whether to allow drag-and-drop functionality. Defaults to true.*/
   allowDragging?: boolean | ((nodeData: LimbleTreeNode) => boolean);
}

/** An object that references the component to be rendered and its bindings */
export interface ComponentObj {
   /** The component class */
   class: Type<unknown>;
   /** The bindings (inputs and outputs) of the class */
   bindings?: {
      [index: string]: unknown;
   };
}

/** The default value for the `indent` option */
export const INDENT = 45;

/** An options object with default values loaded where applicable */
export interface ProcessedOptions extends LimbleTreeOptions {
   defaultComponent?: ComponentObj;
   indent: number;
   allowNesting: boolean | ((nodeData: LimbleTreeNode) => boolean);
   allowDragging: boolean | ((nodeData: LimbleTreeNode) => boolean);
}

@Injectable()
export class TreeService {
   public changes$: BehaviorSubject<null>;
   private host: ViewContainerRef | undefined;
   public treeData: LimbleTreeData | undefined;
   public treeOptions: ProcessedOptions | undefined;
   public treeModel: Branch<any>;

   constructor(
      private readonly componentCreatorService: ComponentCreatorService,
      private readonly dropZoneService: DropZoneService
   ) {
      this.changes$ = new BehaviorSubject(null);
      this.treeModel = new Branch(null);
   }

   /** Initializes the service and renders the tree.
    * @param host - The ViewContainerRef into which the tree will be rendered.
    * @param data - The data array that was passed in to LimbleTreeRoot, which is
    * the users' representation of the tree
    * @param options - The options object that was passed in to LimbleTreeRoot
    */
   public init(
      host: ViewContainerRef,
      data: LimbleTreeData,
      options?: LimbleTreeOptions
   ): void {
      this.host = host;
      this.treeData = data;
      this.treeOptions = this.processOptions(options);
      this.render();
   }

   /** Renders the entire tree from root to leaves */
   private render() {
      if (
         this.host === undefined ||
         this.treeData === undefined ||
         this.treeOptions === undefined
      ) {
         throw new Error("TreeModel not initialized");
      }
      this.host.clear();
      this.treeModel = new Branch(null);
      this.dropZoneService.clearDropZones();
      this.dropZoneService.init(this.treeData, this.treeOptions);
      for (const node of this.treeData) {
         const branch = new Branch(node);
         this.treeModel.appendChild(branch);
      }
      for (const branch of this.treeModel.getChildren()) {
         const componentRef = this.componentCreatorService.appendComponent<LimbleTreeNodeComponent>(
            LimbleTreeNodeComponent,
            this.host
         );
         componentRef.instance.branch = branch;
         //The LimbleTreeNodeComponent will (indirectly) call the `renderBranch` method of this service to render
         //its own children
      }
      this.changes$.next(null);
   }

   /** Renders a branch of the tree and all of its descendants */
   public renderBranch(host: ViewContainerRef, branch: Branch<any>) {
      if (this.treeModel === undefined) {
         throw new Error("TreeModel not initialized");
      }
      host.clear();
      for (const node of branch.data.nodes ?? []) {
         const newBranch = new Branch(node);
         branch.appendChild(newBranch);
         const componentRef = this.componentCreatorService.appendComponent<LimbleTreeNodeComponent>(
            LimbleTreeNodeComponent,
            host
         );
         componentRef.instance.branch = newBranch;
         //The LimbleTreeNodeComponent will (indirectly) call the `renderBranch` method of this service to render
         //its own children
      }
   }

   private processOptions(options: LimbleTreeOptions = {}): ProcessedOptions {
      return {
         defaultComponent: options.defaultComponent,
         indent: options.indent ?? INDENT,
         allowNesting: options.allowNesting ?? true,
         allowDragging: options.allowDragging ?? true
      };
   }

   public move(source: Branch<any>, targetCoordinates: BranchCoordinates) {
      const targetParentCoordinates = [...targetCoordinates];
      const index = targetParentCoordinates.pop();
      if (index === undefined) {
         throw new Error("target coordinates are empty");
      }
      const targetParent = this.treeModel.getDescendant(
         targetParentCoordinates
      );
      if (targetParent === undefined) {
         throw new Error("could not get to target");
      }
      targetParent.insertChild(source, index);
      this.rebuildTreeData();
      this.render();
   }

   private rebuildTreeData(): void {
      if (this.treeData == undefined) {
         throw new Error("Tree data not initialized");
      }
      this.treeData.length = 0;
      for (const branch of this.treeModel.getChildren()) {
         this.treeData.push(this.rebuildBranch(branch));
      }
   }

   private rebuildBranch(branch: Branch<any>): LimbleTreeNode {
      const temp: LimbleTreeNode = branch.data;
      temp.nodes = [];
      for (const child of branch.getChildren()) {
         temp.nodes.push(this.rebuildBranch(child));
      }
      return temp;
   }
}
