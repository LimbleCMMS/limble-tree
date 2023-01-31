import { TreeRoot } from "../../core/tree-root/tree-root";
import { getViewContainer } from "../../test-util/virtual";
import { TreeService } from "./tree.service";

describe("TreeService", () => {
   it("should create a new, empty tree", () => {
      const treeService = new TreeService();
      const newTree = treeService.createEmptyTree(getViewContainer());
      expect(newTree).toBeInstanceOf(TreeRoot);
      expect(newTree.branches().length).toBe(0);
   });
});
