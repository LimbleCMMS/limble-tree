import { assert } from "../../../shared";
import { TreeRoot } from "../../core";
import { EmptyComponent, getViewContainer } from "../../test-util";
import { TreeService } from "./tree.service";

describe("TreeService", () => {
   it("should create a new, empty tree", () => {
      const treeService = new TreeService();
      const newTree = treeService.createEmptyTree(getViewContainer());
      expect(newTree).toBeInstanceOf(TreeRoot);
      expect(newTree.branches().length).toBe(0);
   });

   it("should clear any preexisting views from the passed container", () => {
      const treeService = new TreeService();
      const container = getViewContainer();
      treeService.createEmptyTree(container);
      expect(container.length).toBe(1);
      treeService.createEmptyTree(container);
      expect(container.length).toBe(1);
   });

   it("should render descendent branches (other than the first generation) in an element whose left margin is equal to the specified indentation", () => {
      const treeService = new TreeService();
      const container = getViewContainer();
      const tree = treeService.createEmptyTree(container, {
         indentation: 10
      });
      const branch = tree.grow(EmptyComponent);
      const treeBranchesContainerElement = tree
         .getNativeElement()
         .getElementsByClassName("branches-container")
         .item(0);
      const branchBranchesContainerElement = branch
         .getNativeElement()
         .getElementsByClassName("branches-container")
         .item(0);
      assert(treeBranchesContainerElement instanceof HTMLElement);
      assert(branchBranchesContainerElement instanceof HTMLElement);
      expect(treeBranchesContainerElement.style.marginLeft).toBe("");
      expect(branchBranchesContainerElement.style.marginLeft).toBe("10px");
   });

   it("should render descendent branches (other than the first generation) in an element whose left margin is equal to 16 in the absence of a specified indentation", () => {
      const treeService = new TreeService();
      const container = getViewContainer();
      const tree = treeService.createEmptyTree(container);
      const branch = tree.grow(EmptyComponent);
      const treeBranchesContainerElement = tree
         .getNativeElement()
         .getElementsByClassName("branches-container")
         .item(0);
      const branchBranchesContainerElement = branch
         .getNativeElement()
         .getElementsByClassName("branches-container")
         .item(0);
      assert(treeBranchesContainerElement instanceof HTMLElement);
      assert(branchBranchesContainerElement instanceof HTMLElement);
      expect(treeBranchesContainerElement.style.marginLeft).toBe("");
      expect(branchBranchesContainerElement.style.marginLeft).toBe("16px");
   });
});
