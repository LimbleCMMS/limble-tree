import { TreeRoot } from "../../core/tree-root/tree-root";
import { EmptyComponent } from "../../test-util/empty.component";
import { getViewContainer } from "../../test-util/virtual";
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
      expect(
         tree
            .getContents()
            .location.nativeElement.getElementsByClassName("branches-container")
            .item(0).style.marginLeft
      ).toBe("");
      expect(
         branch
            .getContents()
            .location.nativeElement.getElementsByClassName("branches-container")
            .item(0).style.marginLeft
      ).toBe("10px");
   });

   it("should render descendent branches (other than the first generation) in an element whose left margin is equal to 16 in the absence of a specified indentation", () => {
      const treeService = new TreeService();
      const container = getViewContainer();
      const tree = treeService.createEmptyTree(container);
      const branch = tree.grow(EmptyComponent);
      expect(
         tree
            .getContents()
            .location.nativeElement.getElementsByClassName("branches-container")
            .item(0).style.marginLeft
      ).toBe("");
      expect(
         branch
            .getContents()
            .location.nativeElement.getElementsByClassName("branches-container")
            .item(0).style.marginLeft
      ).toBe("16px");
   });
});
