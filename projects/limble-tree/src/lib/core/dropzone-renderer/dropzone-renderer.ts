import { ComponentRef } from "@angular/core";
import { assert } from "../../../shared/assert";
import { BranchComponent } from "../../components/branch/branch.component";
import { DropzoneComponent } from "../../components/dropzone/dropzone.component";
import { NodeComponent } from "../../components/node-component.interface";
import { ContainerTreeNode } from "../../structure/nodes/container-tree-node.interface";
import { TreeBranch } from "../tree-branch/tree-branch";
import { TreeRoot } from "../tree-root/tree-root";

class DropzoneRenderer {
   private readonly registry: Map<
      DropzoneComponent,
      TreeBranch<any> | TreeRoot<any>
   >;
   private currentDisplay: {
      treeBranch: TreeBranch<any>;
      direction: "upper" | "lower";
   } | null;

   public constructor() {
      this.registry = new Map();
      this.currentDisplay = null;
   }

   public clearCurrentDisplay(): void {
      if (this.currentDisplay === null) return;
      for (const branch of this.registry.values()) {
         const instance = branch.getContents().instance;
         instance.showInnerDropzone = false;
         if (instance instanceof BranchComponent) {
            instance.showLateralDropzone = false;
         }
      }
      this.currentDisplay = null;
   }

   public getDropzoneLocation<T>(
      dropzone: DropzoneComponent
   ): [TreeBranch<T> | TreeRoot<T>, "inner" | "lateral"] {
      const branch = this.registry.get(dropzone);
      const placement = dropzone.placement;
      if (branch === undefined) {
         throw new Error("dropzone not found in registry");
      }
      if (placement === undefined) {
         throw new Error("dropzone has an undefined placement");
      }
      return [branch, placement];
   }

   public registerDropzone<T>(
      dropzone: DropzoneComponent,
      treeNode: TreeBranch<T> | TreeRoot<T>
   ): void {
      this.registry.set(dropzone, treeNode);
   }

   public registerDropzones<T>(
      dropzones: Iterable<DropzoneComponent>,
      treeBranch: TreeBranch<T>
   ): void {
      for (const dropzone of dropzones) {
         this.registry.set(dropzone, treeBranch);
      }
   }

   public showLowerZones<T>(treeBranch: TreeBranch<T>): void {
      if (
         this.currentDisplay?.treeBranch === treeBranch &&
         this.currentDisplay.direction === "lower"
      ) {
         return;
      }
      this.clearCurrentDisplay();
      treeBranch.getContents().instance.showInnerDropzone = true;
      if (treeBranch.branches().length === 0) {
         this.loopThroughLowerZones(treeBranch);
      }
      this.currentDisplay = { treeBranch, direction: "lower" };
   }

   public showUpperZones<T>(treeBranch: TreeBranch<T>): void {
      if (
         this.currentDisplay?.treeBranch === treeBranch &&
         this.currentDisplay.direction === "upper"
      ) {
         return;
      }
      this.clearCurrentDisplay();
      this.loopThroughUpperZones(treeBranch);
      this.currentDisplay = { treeBranch, direction: "upper" };
   }

   private loopThroughLowerZones<T>(treeBranch: TreeBranch<T>): void {
      let cursor:
         | ContainerTreeNode<ComponentRef<NodeComponent>, TreeBranch<T>>
         | undefined = treeBranch;
      while (cursor instanceof TreeBranch) {
         cursor.getContents().instance.showLateralDropzone = true;
         const parent = cursor.parent();
         const index = cursor.index();
         assert(parent !== undefined && index !== undefined);
         if (parent.branches().length > index + 1) {
            return;
         }
         cursor = cursor.parent();
      }
   }

   private loopThroughUpperZones<T>(treeBranch: TreeBranch<T>): void {
      let cursor = treeBranch
         .parent()
         ?.getBranch((treeBranch.index() ?? 0) - 1);
      let final = treeBranch.parent();
      while (cursor !== undefined) {
         cursor.getContents().instance.showLateralDropzone = true;
         final = cursor;
         cursor = cursor.branches().at(-1);
      }
      if (final !== undefined) {
         final.getContents().instance.showInnerDropzone = true;
      }
   }
}

export const dropzoneRenderer = new DropzoneRenderer();
