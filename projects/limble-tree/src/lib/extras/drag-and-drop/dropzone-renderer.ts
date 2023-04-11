import { assert } from "../../../shared";
import { BranchComponent, type DropzoneComponent } from "../../components";
import { dragState, DragStates } from "./drag-state";
import { dragAndDrop } from "./drag-and-drop";
import { TreeBranch, type TreeNode, TreeRoot, config } from "../../core";
import { filter, first } from "rxjs";
import { PruneEvent } from "../../events";

class DropzoneRenderer {
   private currentDisplay: {
      treeBranch: TreeNode<any>;
      direction: "upper" | "lower";
   } | null;
   private readonly registry: Map<DropzoneComponent, TreeNode<any>>;

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
            branch
               .events()
               .pipe(
                  filter((event) => event instanceof PruneEvent),
                  first()
               )
               .subscribe(() => {
                  assert(final !== undefined);
                  this.showLowerZones(final);
               });
         });
   }

   public clearCurrentDisplay(): void {
      if (this.currentDisplay === null) return;
      for (const branch of this.registry.values()) {
         const instance = branch.getComponentInstance();
         instance.showInnerDropzone = false;
         if (instance instanceof BranchComponent) {
            instance.showLateralDropzone = false;
         }
      }
      this.currentDisplay = null;
   }

   public clearTreeFromRegistry(tree: TreeNode<any>): void {
      const nodes: Array<TreeNode<any>> = [];
      tree.traverse((node) => nodes.push(node));
      for (const [dropzoneComponent, treeNode] of this.registry) {
         if (nodes.includes(treeNode)) {
            this.registry.delete(dropzoneComponent);
         }
      }
   }

   public getCurrentDisplay(): {
      treeBranch: TreeNode<any>;
      direction: "upper" | "lower";
   } | null {
      if (this.currentDisplay === null) return null;
      return { ...this.currentDisplay };
   }

   public getDropzoneLocation<T>(
      dropzone: DropzoneComponent
   ): [TreeNode<T>, "inner" | "lateral"] {
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
      treeNode: TreeNode<T>,
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
      treeNode: TreeNode<T>
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

   public showLowerZones<T>(treeNode: TreeNode<T>): void {
      this.clearCurrentDisplay();
      this.showInnerZone(treeNode);
      if (treeNode.branches().length === 0) {
         this.loopThroughLowerZones(treeNode);
      }
      this.currentDisplay = { treeBranch: treeNode, direction: "lower" };
   }

   public showUpperZones<T>(treeBranch: TreeBranch<T>): void {
      this.clearCurrentDisplay();
      this.loopThroughUpperZones(treeBranch);
      this.currentDisplay = { treeBranch, direction: "upper" };
   }

   private loopThroughLowerZones<T>(treeNode: TreeNode<T>): void {
      let cursor: TreeNode<T> | undefined = treeNode;
      while (cursor instanceof TreeBranch) {
         this.showLateralZone(cursor);
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
         this.showLateralZone(cursor);
         final = cursor;
         cursor = cursor.branches().at(-1);
      }
      if (
         final !== undefined &&
         (final instanceof TreeRoot || final instanceof TreeBranch)
      ) {
         this.showInnerZone(final);
      }
   }

   private nestingAllowed<T>(treeNode: TreeNode<T>): boolean {
      if (treeNode instanceof TreeRoot) {
         return true;
      }
      if (treeNode instanceof TreeBranch) {
         const allowNesting =
            config.getConfig(treeNode.root())?.dragAndDrop?.allowNesting ??
            ((): true => true);
         return allowNesting(treeNode);
      }
      throw new Error("unsupported treeNode type");
   }

   private dropAllowed(parent: unknown, index: number): boolean {
      const sourceNode = dragState.getDragData();
      assert(sourceNode instanceof TreeBranch);
      if (parent instanceof TreeRoot) {
         const allowDrop =
            config.getConfig(parent)?.dragAndDrop?.allowDrop ??
            ((): true => true);
         return allowDrop(sourceNode, parent, index);
      }
      if (parent instanceof TreeBranch) {
         const allowDrop =
            config.getConfig(parent.root())?.dragAndDrop?.allowDrop ??
            ((): true => true);
         return allowDrop(sourceNode, parent, index);
      }
      throw new Error("unsupported treeNode type");
   }

   private showInnerZone<T>(treeNode: TreeNode<T>): void {
      if (!this.nestingAllowed(treeNode) || !this.dropAllowed(treeNode, 0))
         return;
      treeNode.getComponentInstance().showInnerDropzone = true;
   }

   private showLateralZone<T>(treeBranch: TreeBranch<T>): void {
      const index = treeBranch.index();
      assert(index !== undefined);
      if (!this.dropAllowed(treeBranch.parent(), index + 1)) return;
      treeBranch.getComponentInstance().showLateralDropzone = true;
   }
}

export const dropzoneRenderer = new DropzoneRenderer();
