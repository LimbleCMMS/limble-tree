import { first } from "rxjs";
import { TreeEvent } from "../../events/tree-event.interface";
import { TreeNode } from "../../structure/tree-node.interface";
import { TreeBranch } from "../tree-branch/tree-branch";
import { getStandardBranch } from "../tree-branch/tree-branch.spec";
import { TreeNodeBase } from "./tree-node-base";

describe("TreeNodeBase", () => {
   it("should start with no branches", () => {
      const node = new TreeNodeBase();
      expect(node.branches()).toEqual([]);
   });

   it("should allow new branches to graft themselves onto it", () => {
      const branch = getStandardBranch();
      const node = new TreeNodeBase();
      branch.graftTo(node);
      expect(branch.parent()).toBe(node);
      expect(node.branches()).toEqual([branch]);
   });

   it("should remove branches that pruned themselves", () => {
      const branch = getStandardBranch();
      const node = new TreeNodeBase();
      branch.graftTo(node);
      branch.prune();
      expect(branch.parent()).not.toBe(node);
      expect(node.branches()).toEqual([]);
   });

   it("should emit any events it receives from descendants", () => {
      const gen1 = new TreeNodeBase();
      const gen2 = getStandardBranch();
      gen2.graftTo(gen1);
      gen1
         .events()
         .pipe(first())
         .subscribe((event) => {
            expect(event).toBe(nullEvent);
         });
      const nullEvent: TreeEvent = { source: () => gen2 };
      gen2.dispatch(nullEvent);
   });

   it("should emit any events it dispatches", () => {
      const node = new TreeNodeBase();
      node
         .events()
         .pipe(first())
         .subscribe((event) => {
            expect(event).toBe(nullEvent);
         });
      const nullEvent: TreeEvent = { source: () => node };
      node.dispatch(nullEvent);
   });

   it("should start with an empty plot", () => {
      const self = new TreeNodeBase();
      expect(self.plot()).toEqual(new Map());
   });

   it("should plot itself and its posterity", () => {
      const root = new TreeNodeBase();
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

   it("should traverse the tree in depth-first order, excluding self", () => {
      const root = new TreeNodeBase();
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
      const nodes: Array<TreeNode<TreeBranch<unknown>>> = [];
      root.traverse((node) => {
         nodes.push(node);
      });
      expect(nodes).toEqual([
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
