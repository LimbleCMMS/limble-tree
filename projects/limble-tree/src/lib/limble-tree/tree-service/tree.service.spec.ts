import { assert } from "../../../shared/assert";
import { getViewContainer } from "../test-util/view-container";
import { Tree } from "../tree/tree";
import { TreeService } from "./tree.service";

describe("TreeService", () => {
   it("should create a new, empty tree", () => {
      const treeService = new TreeService();
      const container = getViewContainer();
      assert(container !== undefined);
      const newTree = treeService.createTree(container);
      expect(newTree).toBeInstanceOf(Tree);
      expect(newTree.count()).toBe(0);
   });
});
