import { first } from "rxjs";
import { TreeBranch } from "../tree-branch/tree-branch";
import { TreeNode } from "../tree-node";
import { TreeRoot } from "./tree-root";

describe("TreeRoot", () => {
   it("should start with no branches", () => {
      const root = new TreeRoot();
      expect(root.branches()).toEqual([]);
   });

   it("should allow new branches to graft themselves onto it", () => {
      const branch = new TreeBranch(null);
      const root = new TreeRoot(null);
      branch.graftTo(root);
      expect(branch.parent()).toBe(root);
      expect(root.branches()).toEqual([branch]);
   });

   it("should remove branches that pruned themselves", () => {
      const branch = new TreeBranch(null);
      const root = new TreeRoot(null);
      branch.graftTo(root);
      branch.prune();
      expect(branch.parent()).not.toBe(root);
      expect(root.branches()).toEqual([]);
   });

   it("should emit any events it receives or generates", () => {
      const gen1 = new TreeRoot(null);
      const gen2 = new TreeBranch(null);
      gen2.graftTo(gen1);
      gen2
         .events()
         .pipe(first())
         .subscribe((event) => {
            expect(event).toBe(nullEvent);
         });
      gen1
         .events()
         .pipe(first())
         .subscribe((event) => {
            expect(event).toBe(nullEvent);
         });
      const nullEvent = { source: gen2 };
      gen2.event(nullEvent);
   });

   it("should start with contents undefined if not passed to constructor", () => {
      const self = new TreeRoot();
      expect(self.getContents()).toBe(undefined);
   });

   it("should hold any data passed at construction", () => {
      const testString = "test string";
      const testNumber = 1;
      const testObject = { propA: 1, propB: "b" };
      const testNull = null;
      const root1 = new TreeRoot(testString);
      const root2 = new TreeRoot(testNumber);
      const root3 = new TreeRoot(testObject);
      const root4 = new TreeRoot(testNull);
      expect(root1.getContents()).toBe(testString);
      expect(root2.getContents()).toBe(testNumber);
      expect(root3.getContents()).toBe(testObject);
      expect(root4.getContents()).toBe(testNull);
   });

   it("should get and set the contents", () => {
      const self = new TreeRoot("O beautiful for spacious skies");
      self.setContents("For amber waves of grain");
      expect(self.getContents()).toEqual("For amber waves of grain");
      self.setContents("For purple mountain majesties");
      expect(self.getContents()).toEqual("For purple mountain majesties");
   });

   it("should always have a root position", () => {
      const self = new TreeRoot();
      expect(self.position()).toEqual([]);
   });

   it("should start with an empty plot", () => {
      const self = new TreeRoot();
      expect(self.plot()).toEqual(new Map());
   });

   it("should plot itself and its posterity", () => {
      const root = new TreeRoot(null);
      const branch1 = new TreeBranch(null);
      const branch1a = new TreeBranch(null);
      const branch1b = new TreeBranch(null);
      const branch2 = new TreeBranch(null);
      const branch3 = new TreeBranch(null);
      const branch3a = new TreeBranch(null);
      const branch3a1 = new TreeBranch(null);
      const branch3ab = new TreeBranch(null);
      const branch3b = new TreeBranch(null);
      branch1.graftTo(root);
      branch2.graftTo(root);
      branch3.graftTo(root);
      branch1a.graftTo(branch1);
      branch1b.graftTo(branch1);
      branch3a.graftTo(branch3);
      branch3b.graftTo(branch3);
      branch3a1.graftTo(branch3a);
      branch3ab.graftTo(branch3a);
      expect(root.plot()).toEqual(
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

   it("should traverse the tree in depth-first order, including self", () => {
      const root = new TreeRoot(null);
      const branch1 = new TreeBranch(null);
      const branch1a = new TreeBranch(null);
      const branch1b = new TreeBranch(null);
      const branch2 = new TreeBranch(null);
      const branch3 = new TreeBranch(null);
      const branch3a = new TreeBranch(null);
      const branch3a1 = new TreeBranch(null);
      const branch3ab = new TreeBranch(null);
      const branch3b = new TreeBranch(null);
      branch1.graftTo(root);
      branch2.graftTo(root);
      branch3.graftTo(root);
      branch1a.graftTo(branch1);
      branch1b.graftTo(branch1);
      branch3a.graftTo(branch3);
      branch3b.graftTo(branch3);
      branch3a1.graftTo(branch3a);
      branch3ab.graftTo(branch3a);
      const nodes: Array<TreeNode<null>> = [];
      root.traverse((node) => {
         nodes.push(node);
      });
      expect(nodes).toEqual([
         root,
         branch1,
         branch1a,
         branch1b,
         branch2,
         branch3,
         branch3a,
         branch3a1,
         branch3ab,
         branch3b
      ]);
   });
});
