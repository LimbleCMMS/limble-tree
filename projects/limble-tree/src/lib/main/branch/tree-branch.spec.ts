import { assert } from "../../../shared/assert";
import { skip, take } from "rxjs";
import { GraftEvent } from "../../events/graft-event";
import { PruneEvent } from "../../events/prune-event";
import { TreeRoot } from "../root/tree-root";
import { TreeBranch } from "./tree-branch";
import { TreeNode } from "../../structure/tree-node.interface";
import { getViewContainer } from "../../test-util/view-container";
import { BranchComponent } from "../../components/branch/branch.component";
import { TestComponent } from "../../test-util/test.component";
import { VirtualTreeRoot } from "../virtual-root/virtual-tree-root";

describe("TreeBranch", () => {
   it("should start with no branches", () => {
      const self = getStandardBranch();
      expect(self.branches()).toEqual([]);
   });

   it("should start with a new virtual root as the parent", () => {
      const self = getStandardBranch();
      expect(self.parent()).toBeInstanceOf(VirtualTreeRoot);
      expect(self.parent().branches()).toEqual([self]);
   });

   it("should graft onto a new parent", () => {
      const self = getStandardBranch();
      const parent = getStandardBranch();
      self.graftTo(parent);
      expect(self.parent()).toBe(parent);
      expect(parent.branches()).toEqual([self]);
   });

   it("should emit a PruneEvent and GraftEvent when grafted onto a new parent", () => {
      const self = getStandardBranch();
      const newParent = getStandardBranch();
      const oldParent = self.parent();
      self
         .events()
         .pipe(take(1))
         .subscribe((event) => {
            expect(event).toBeInstanceOf(PruneEvent);
            assert(event instanceof PruneEvent);
            expect(event.source).toBe(self);
            expect(event.child).toBe(self);
            expect(event.parent).toBe(oldParent);
         });
      self
         .events()
         .pipe(skip(1), take(1))
         .subscribe((event) => {
            expect(event).toBeInstanceOf(GraftEvent);
            assert(event instanceof GraftEvent);
            expect(event.source).toBe(self);
            expect(event.child).toBe(self);
            expect(event.parent).toBe(newParent);
         });
      self.graftTo(newParent);
   });

   it("should emit any events it receives or generates", () => {
      const gen1 = getStandardBranch();
      const gen2 = getStandardBranch();
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
      const root = new TreeRoot(getViewContainer());
      const gen1 = getStandardBranch();
      const gen2 = getStandardBranch();
      const gen3 = getStandardBranch();
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
      const self = getStandardBranch();
      expect(self.index()).toBe(0);
   });

   it("should get its own index relative to its siblings", () => {
      const parent = getStandardBranch();
      const child1 = getStandardBranch();
      const child2 = getStandardBranch();
      const child3 = getStandardBranch();
      child1.graftTo(parent);
      child2.graftTo(parent);
      child3.graftTo(parent);
      expect(child1.index()).toBe(0);
      expect(child2.index()).toBe(1);
      expect(child3.index()).toBe(2);
   });

   it("should prune itself from its parent", () => {
      const parent = getStandardBranch();
      const child = getStandardBranch();
      child.graftTo(parent);
      child.prune();
      expect(child.parent()).not.toBe(parent);
      expect(parent.branches()).toEqual([]);
      expect(child.index()).toBe(0);
   });

   it("should emit a PruneEvent when pruned", () => {
      const parent = getStandardBranch();
      const child = getStandardBranch();
      child.graftTo(parent);
      child
         .events()
         .pipe(take(1))
         .subscribe((event) => {
            expect(event).toBeInstanceOf(PruneEvent);
            assert(event instanceof PruneEvent);
            expect(event.source).toBe(child);
            expect(event.child).toBe(child);
            expect(event.parent).toBe(parent);
         });
      child.prune();
   });

   it("should get and set the contents", () => {
      const self = getStandardBranch();
      const nodeRef1 = getNodeRef();
      const nodeRef2 = getNodeRef();
      self.setContents(nodeRef1);
      expect(self.getContents()).toEqual(nodeRef1);
      self.setContents(nodeRef2);
      expect(self.getContents()).toEqual(nodeRef2);
   });

   it("should get its own position in the tree", () => {
      const self = getStandardBranch();
      expect(self.position()).toEqual([0]);
      const parent = getStandardBranch();
      self.graftTo(parent);
      expect(self.position()).toEqual([0, 0]);
      const sib1 = getStandardBranch();
      const sib2 = getStandardBranch();
      const sib3 = getStandardBranch();
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
      const self = getStandardBranch();
      expect(self.plot()).toEqual(new Map());
   });

   it("should plot itself and its posterity", () => {
      const self = getStandardBranch();
      const branch1 = getStandardBranch();
      const branch1a = getStandardBranch();
      const branch1b = getStandardBranch();
      const branch2 = getStandardBranch();
      const branch3 = getStandardBranch();
      const branch3a = getStandardBranch();
      const branch3a1 = getStandardBranch();
      const branch3ab = getStandardBranch();
      const branch3b = getStandardBranch();
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
      const self = getStandardBranch();
      const branch1 = getStandardBranch();
      const branch1a = getStandardBranch();
      const branch1b = getStandardBranch();
      const branch2 = getStandardBranch();
      const branch3 = getStandardBranch();
      const branch3a = getStandardBranch();
      const branch3a1 = getStandardBranch();
      const branch3ab = getStandardBranch();
      const branch3b = getStandardBranch();
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
      const self = getStandardBranch();
      const parent = getStandardBranch();
      const sib1 = getStandardBranch();
      const sib2 = getStandardBranch();
      const sib3 = getStandardBranch();
      sib1.graftTo(parent);
      sib2.graftTo(parent);
      sib3.graftTo(parent);
      self.graftTo(parent, 2);
      expect(parent.branches()).toEqual([sib1, sib2, self, sib3]);
      expect(self.index()).toBe(2);
      expect(sib3.index()).toBe(3);
   });
});

export function getStandardBranch(): TreeBranch<TestComponent> {
   const nodeRef = getNodeRef();
   return new TreeBranch(nodeRef);
}

export function getNodeRef() {
   const nodeRef =
      getViewContainer().createComponent<BranchComponent<TestComponent>>(
         BranchComponent
      );
   nodeRef.instance.content = TestComponent;
   nodeRef.changeDetectorRef.detectChanges();
   return nodeRef;
}
