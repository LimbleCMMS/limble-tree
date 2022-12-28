import { getViewContainer } from "../test-util/view-container";
import { TreeCursor } from "../tree-cursor/tree-cursor";
import { TreeService } from "../tree-service/tree.service";

describe("Tree", () => {
   const treeService = new TreeService();
   it("should get a cursor pointing to a root node", () => {
      const tree = treeService.createTree(getViewContainer());
      const cursor = tree.getCursor();
      expect(cursor).toBeInstanceOf(TreeCursor);
      expect(cursor.atRoot()).toBe(true);
   });

   it("should start with zero nodes", () => {
      const tree = treeService.createTree(getViewContainer());
      expect(tree.count()).toBe(0);
   });

   it("should start with an empty plot", () => {
      const tree = treeService.createTree(getViewContainer());
      expect(tree.plot()).toEqual(new Map());
   });

   it("should plot itself and its posterity", () => {
      const tree = treeService.createTree(getViewContainer());
      const cursor = tree.getCursor();
      cursor.growBranch();
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepIn();
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepOut();
      cursor.stepIn(2);
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepIn();
      cursor.growBranch();
      cursor.growBranch();
      expect(tree.plot()).toEqual(
         new Map([
            [
               0,
               new Map([
                  [0, new Map()],
                  [1, new Map()]
               ])
            ],
            [1, new Map()],
            [
               2,
               new Map([
                  [
                     0,
                     new Map([
                        [0, new Map()],
                        [1, new Map()]
                     ])
                  ],
                  [1, new Map()]
               ])
            ]
         ])
      );
   });

   it("should count the number of branches in the tree, not including the root", () => {
      const tree = treeService.createTree(getViewContainer());
      const cursor = tree.getCursor();
      cursor.growBranch();
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepIn();
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepOut();
      cursor.stepIn(2);
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepIn();
      cursor.growBranch();
      cursor.growBranch();
      expect(tree.count()).toBe(9);
   });
});
