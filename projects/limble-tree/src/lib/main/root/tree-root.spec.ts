import { first } from "rxjs";
import { getViewContainer } from "../../test-util/view-container";
import { getStandardBranch } from "../../main/branch/tree-branch.spec";
import { TreeNode } from "../../structure/tree-node.interface";
import { TreeRoot } from "./tree-root";

describe("TreeRoot", () => {
   it("should start with no branches", () => {
      const root = new TreeRoot(getViewContainer());
      expect(root.branches()).toEqual([]);
   });

   it("should allow new branches to graft themselves onto it", () => {
      const branch = getStandardBranch();
      const root = new TreeRoot(getViewContainer());
      branch.graftTo(root);
      expect(branch.parent()).toBe(root);
      expect(root.branches()).toEqual([branch]);
   });

   it("should remove branches that pruned themselves", () => {
      const branch = getStandardBranch();
      const root = new TreeRoot(getViewContainer());
      branch.graftTo(root);
      branch.prune();
      expect(branch.parent()).not.toBe(root);
      expect(root.branches()).toEqual([]);
   });

   it("should emit any events it receives or generates", () => {
      const gen1 = new TreeRoot(getViewContainer());
      const gen2 = getStandardBranch();
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

   it("should always have a root position", () => {
      const self = new TreeRoot(getViewContainer());
      expect(self.position()).toEqual([]);
   });

   it("should start with an empty plot", () => {
      const self = new TreeRoot(getViewContainer());
      expect(self.plot()).toEqual(new Map());
   });

   it("should plot itself and its posterity", () => {
      const root = new TreeRoot(getViewContainer());
      const branch1 = getStandardBranch();
      const branch1a = getStandardBranch();
      const branch1b = getStandardBranch();
      const branch2 = getStandardBranch();
      const branch3 = getStandardBranch();
      const branch3a = getStandardBranch();
      const branch3a1 = getStandardBranch();
      const branch3ab = getStandardBranch();
      const branch3b = getStandardBranch();
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
      const root = new TreeRoot(getViewContainer());
      const branch1 = getStandardBranch();
      const branch1a = getStandardBranch();
      const branch1b = getStandardBranch();
      const branch2 = getStandardBranch();
      const branch3 = getStandardBranch();
      const branch3a = getStandardBranch();
      const branch3a1 = getStandardBranch();
      const branch3ab = getStandardBranch();
      const branch3b = getStandardBranch();
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