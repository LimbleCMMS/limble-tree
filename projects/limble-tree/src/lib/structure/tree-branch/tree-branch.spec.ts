import { assert } from "../../../shared/assert";
import { skip, take } from "rxjs";
import { GraftEvent } from "../../events/graft-event";
import { PruneEvent } from "../../events/prune-event";
import { TreeRoot } from "../tree-root/tree-root";
import { TreeBranch } from "./tree-branch";
import { TreeNode } from "../tree-node";

describe("TreeBranch", () => {
   it("should start with no branches", () => {
      const self = new TreeBranch(null);
      expect(self.branches()).toEqual([]);
   });

   it("should start with a new root as the parent", () => {
      const self = new TreeBranch(null);
      expect(self.parent()).toBeInstanceOf(TreeRoot);
      expect(self.parent().branches()).toEqual([self]);
   });

   it("should graft onto a new parent", () => {
      const self = new TreeBranch(null);
      const parent = new TreeBranch(null);
      self.graftTo(parent);
      expect(self.parent()).toBe(parent);
      expect(parent.branches()).toEqual([self]);
   });

   it("should emit a PruneEvent and GraftEvent when grafted onto a new parent", () => {
      const self = new TreeBranch(null);
      const newParent = new TreeBranch(null);
      const oldParent = self.parent();
      self
         .events()
         .pipe(take(1))
         .subscribe((event) => {
            expect(event).toBeInstanceOf(PruneEvent);
            assert(event instanceof PruneEvent);
            expect(event.source).toBe(self);
            expect(event.oldRelationship.getChild()).toBe(self);
            expect(event.oldRelationship.getParent()).toBe(oldParent);
         });
      self
         .events()
         .pipe(skip(1), take(1))
         .subscribe((event) => {
            expect(event).toBeInstanceOf(GraftEvent);
            assert(event instanceof GraftEvent);
            expect(event.source).toBe(self);
            expect(event.newRelationship.getChild()).toBe(self);
            expect(event.newRelationship.getParent()).toBe(newParent);
         });
      self.graftTo(newParent);
   });

   it("should emit any events it receives or generates", () => {
      const gen1 = new TreeBranch(null);
      const gen2 = new TreeBranch(null);
      gen2.graftTo(gen1);
      gen2
         .events()
         .pipe(take(1))
         .subscribe((event) => {
            expect(event).toBe(nullEvent);
         });
      gen1
         .events()
         .pipe(take(1))
         .subscribe((event) => {
            expect(event).toBe(nullEvent);
         });
      const nullEvent = { source: gen2 };
      gen2.event(nullEvent);
   });

   it("should bubble events up the tree", () => {
      const root = new TreeRoot(null);
      const gen1 = new TreeBranch(null);
      const gen2 = new TreeBranch(null);
      const gen3 = new TreeBranch(null);
      gen3.graftTo(gen2);
      gen2.graftTo(gen1);
      gen1.graftTo(root);
      root
         .events()
         .pipe(take(1))
         .subscribe((event) => {
            expect(event).toBe(nullEvent);
         });
      const nullEvent = { source: gen3 };
      gen3.event(nullEvent);
   });

   it("should start with index zero", () => {
      const self = new TreeBranch(null);
      expect(self.index()).toBe(0);
   });

   it("should get its own index relative to its siblings", () => {
      const parent = new TreeBranch(null);
      const child1 = new TreeBranch(null);
      const child2 = new TreeBranch(null);
      const child3 = new TreeBranch(null);
      child1.graftTo(parent);
      child2.graftTo(parent);
      child3.graftTo(parent);
      expect(child1.index()).toBe(0);
      expect(child2.index()).toBe(1);
      expect(child3.index()).toBe(2);
   });

   it("should prune itself from its parent", () => {
      const parent = new TreeBranch(null);
      const child = new TreeBranch(null);
      child.graftTo(parent);
      child.prune();
      expect(child.parent()).not.toBe(parent);
      expect(parent.branches()).toEqual([]);
      expect(child.index()).toBe(0);
   });

   it("should emit a PruneEvent when pruned", () => {
      const parent = new TreeBranch(null);
      const child = new TreeBranch(null);
      child.graftTo(parent);
      child
         .events()
         .pipe(take(1))
         .subscribe((event) => {
            expect(event).toBeInstanceOf(PruneEvent);
            assert(event instanceof PruneEvent);
            expect(event.source).toBe(child);
            expect(event.oldRelationship.getChild()).toBe(child);
            expect(event.oldRelationship.getParent()).toBe(parent);
         });
      child.prune();
   });

   it("should hold any data passed at construction", () => {
      const testString = "test string";
      const testNumber = 1;
      const testObject = { propA: 1, propB: "b" };
      const testNull = null;
      const root1 = new TreeBranch(testString);
      const root2 = new TreeBranch(testNumber);
      const root3 = new TreeBranch(testObject);
      const root4 = new TreeBranch(testNull);
      expect(root1.getContents()).toBe(testString);
      expect(root2.getContents()).toBe(testNumber);
      expect(root3.getContents()).toBe(testObject);
      expect(root4.getContents()).toBe(testNull);
   });

   it("should get and set the contents", () => {
      const self = new TreeBranch("O beautiful for spacious skies");
      self.setContents("For amber waves of grain");
      expect(self.getContents()).toEqual("For amber waves of grain");
      self.setContents("For purple mountain majesties");
      expect(self.getContents()).toEqual("For purple mountain majesties");
   });

   it("should get its own position in the tree", () => {
      const self = new TreeBranch(null);
      expect(self.position()).toEqual([0]);
      const parent = new TreeBranch(null);
      self.graftTo(parent);
      expect(self.position()).toEqual([0, 0]);
      const sib1 = new TreeBranch(null);
      const sib2 = new TreeBranch(null);
      const sib3 = new TreeBranch(null);
      self.prune();
      expect(self.position()).toEqual([0]);
      sib1.graftTo(parent);
      sib2.graftTo(parent);
      self.graftTo(parent);
      sib3.graftTo(parent);
      expect(sib1.position()).toEqual([0, 0]);
      expect(sib2.position()).toEqual([0, 1]);
      expect(self.position()).toEqual([0, 2]);
      expect(sib3.position()).toEqual([0, 3]);
   });

   it("should start with an empty plot", () => {
      const self = new TreeBranch(null);
      expect(self.plot()).toEqual(new Map());
   });

   it("should plot itself and its posterity", () => {
      const self = new TreeBranch(null);
      const branch1 = new TreeBranch(null);
      const branch1a = new TreeBranch(null);
      const branch1b = new TreeBranch(null);
      const branch2 = new TreeBranch(null);
      const branch3 = new TreeBranch(null);
      const branch3a = new TreeBranch(null);
      const branch3a1 = new TreeBranch(null);
      const branch3ab = new TreeBranch(null);
      const branch3b = new TreeBranch(null);
      branch1.graftTo(self);
      branch2.graftTo(self);
      branch3.graftTo(self);
      branch1a.graftTo(branch1);
      branch1b.graftTo(branch1);
      branch3a.graftTo(branch3);
      branch3b.graftTo(branch3);
      branch3a1.graftTo(branch3a);
      branch3ab.graftTo(branch3a);
      expect(self.plot()).toEqual(
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
      const self = new TreeBranch(null);
      const branch1 = new TreeBranch(null);
      const branch1a = new TreeBranch(null);
      const branch1b = new TreeBranch(null);
      const branch2 = new TreeBranch(null);
      const branch3 = new TreeBranch(null);
      const branch3a = new TreeBranch(null);
      const branch3a1 = new TreeBranch(null);
      const branch3ab = new TreeBranch(null);
      const branch3b = new TreeBranch(null);
      branch1.graftTo(self);
      branch2.graftTo(self);
      branch3.graftTo(self);
      branch1a.graftTo(branch1);
      branch1b.graftTo(branch1);
      branch3a.graftTo(branch3);
      branch3b.graftTo(branch3);
      branch3a1.graftTo(branch3a);
      branch3ab.graftTo(branch3a);
      const nodes: Array<TreeNode<null>> = [];
      self.traverse((node) => {
         nodes.push(node);
      });
      expect(nodes).toEqual([
         self,
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

   it("should graft onto a new parent at the specified index, incrementing the indexes of younger siblings", () => {
      const self = new TreeBranch(null);
      const parent = new TreeBranch(null);
      const sib1 = new TreeBranch(null);
      const sib2 = new TreeBranch(null);
      const sib3 = new TreeBranch(null);
      sib1.graftTo(parent);
      sib2.graftTo(parent);
      sib3.graftTo(parent);
      self.graftTo(parent, 2);
      expect(parent.branches()).toEqual([sib1, sib2, self, sib3]);
      expect(self.index()).toBe(2);
      expect(sib3.index()).toBe(3);
   });
});
