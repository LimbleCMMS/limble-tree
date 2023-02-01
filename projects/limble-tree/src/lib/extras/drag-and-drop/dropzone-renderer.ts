import { ComponentRef } from "@angular/core";
import { assert } from "../../../shared/assert";
import { BranchComponent } from "../../components/branch/branch.component";
import { DropzoneComponent } from "../../components/dropzone/dropzone.component";
import { NodeComponent } from "../../components/node-component.interface";
import { dragAndDrop } from "./drag-and-drop";
import { ContainerTreeNode } from "../../structure/nodes/container-tree-node.interface";
import { TreeBranch } from "../../core/tree-branch/tree-branch";
import { TreeRoot } from "../../core/tree-root/tree-root";
import { dragState, DragStates } from "./drag-state";
import { filter } from "rxjs";

class DropzoneRenderer {
   private currentDisplay: {
      treeBranch: TreeBranch<any> | TreeRoot<any>;
      direction: "upper" | "lower";
   } | null;
   private readonly registry: Map<
      DropzoneComponent,
      TreeBranch<any> | TreeRoot<any>
   >;

   public constructor() {
      this.registry = new Map();
      this.currentDisplay = null;
      dragAndDrop.dragAborted$.subscribe(() => {
         this.clearCurrentDisplay();
      });
      dragState
         .events()
         .pipe(filter((event) => event === DragStates.Starting))
         .subscribe(() => {
            const branch = dragState.getDragData();
            assert(branch !== undefined);
            let cursor = branch.parent()?.getBranch((branch.index() ?? 0) - 1);
            let final = branch.parent();
            while (cursor !== undefined) {
               final = cursor;
               cursor = cursor.branches().at(-1);
            }
            // Gotta do a settimeout so that showLowerZones doesn't run until after
            // the dragged branch is pruned.
            setTimeout(() => {
               assert(final instanceof TreeBranch || final instanceof TreeRoot);
               this.showLowerZones(final);
            });
         });
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

   public handleDrop<T>(
      treeNode: TreeBranch<T> | TreeRoot<T>,
      placement: "inner" | "lateral"
   ): void {
      if (placement === "inner") {
         dragAndDrop.drop(treeNode, 0);
      } else if (treeNode instanceof TreeBranch && placement === "lateral") {
         const currentParent = treeNode.parent();
         const index = treeNode.index();
         if (currentParent === undefined || index === undefined) {
            throw new Error("branch must have a parent");
         }
         dragAndDrop.drop(currentParent, index + 1);
      }
      this.clearCurrentDisplay();
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

   public showLowerZones<T>(treeNode: TreeBranch<T> | TreeRoot<T>): void {
      if (
         this.currentDisplay?.treeBranch === treeNode &&
         this.currentDisplay.direction === "lower"
      ) {
         return;
      }
      this.clearCurrentDisplay();
      treeNode.getContents().instance.showInnerDropzone = true;
      if (treeNode.branches().length === 0) {
         this.loopThroughLowerZones(treeNode);
      }
      this.currentDisplay = { treeBranch: treeNode, direction: "lower" };
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

   private loopThroughLowerZones<T>(
      treeNode: TreeBranch<T> | TreeRoot<T>
   ): void {
      let cursor:
         | ContainerTreeNode<ComponentRef<NodeComponent>, TreeBranch<T>>
         | undefined = treeNode;
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
