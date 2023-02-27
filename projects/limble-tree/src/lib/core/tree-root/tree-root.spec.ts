import { first } from "rxjs";
import { TreeNode } from "../../structure/tree-node.interface";
import { TreeRoot } from "./tree-root";
import { TreeBranch } from "../tree-branch/tree-branch";
import { ViewRef } from "@angular/core";
import { getViewContainer } from "../../test-util/virtual";
import { getStandardBranch } from "../../test-util/standard-branch";
import { EmptyComponent } from "../../test-util/empty.component";
import { createNullEvent } from "../../test-util/null-event";
import { TreeEvent } from "../../structure";

describe("TreeRoot", () => {
   it("should start with no branches", () => {
      const root = new TreeRoot(getViewContainer());
      expect(root.branches()).toEqual([]);
   });

   it("should allow new branches to graft themselves onto it", () => {
      const branch = getStandardBranch();
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      branch.graftTo(root);
      expect(branch.parent()).toBe(root);
      expect(root.branches()).toEqual([branch]);
   });

   it("should remove branches that pruned themselves", () => {
      const branch = getStandardBranch();
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      branch.graftTo(root);
      branch.prune();
      expect(branch.parent()).not.toBe(root);
      expect(root.branches()).toEqual([]);
   });

   it("should emit any events it receives from descendants", () => {
      const gen1 = new TreeRoot<EmptyComponent>(getViewContainer());
      const gen2 = getStandardBranch();
      gen2.graftTo(gen1);
      gen1
         .events()
         .pipe(first())
         .subscribe((event) => {
            expect(event).toBe(nullEvent);
         });
      const nullEvent: TreeEvent = createNullEvent(gen2);
      gen2.dispatch(nullEvent);
   });

   it("should emit any events it dispatches", () => {
      const root = new TreeRoot(getViewContainer());
      root
         .events()
         .pipe(first())
         .subscribe((event) => {
            expect(event).toBe(nullEvent);
         });
      const nullEvent: TreeEvent = createNullEvent(root);
      root.dispatch(nullEvent);
   });

   it("should start with an empty plot", () => {
      const self = new TreeRoot(getViewContainer());
      expect(self.plot()).toEqual(new Map());
   });

   it("should plot itself and its posterity", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
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
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
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
      const nodes: Array<TreeNode<TreeBranch<EmptyComponent>>> = [];
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

   it("Should have a componentRef whose component is rendered in the passed view container", () => {
      const viewContainerRef = getViewContainer();
      const self = new TreeRoot(viewContainerRef);
      expect(self.getContents().hostView).toBe(
         viewContainerRef.get(0) as ViewRef
      );
   });

   it("should grow a child branch", () => {
      const self = new TreeRoot(getViewContainer());
      self.grow(EmptyComponent);
      expect(self.plot()).toEqual(new Map([[0, new Map()]]));
      expect(
         Array.from(document.getElementsByTagName("empty-component")).length
      ).toBe(1);
   });

   it("should grow a child branch with bindings", () => {
      const self = new TreeRoot<EmptyComponent>(getViewContainer());
      self.grow(EmptyComponent, { inputBindings: { testInput: "testing" } });
      expect(self.plot()).toEqual(new Map([[0, new Map()]]));
      expect(
         Array.from(document.getElementsByTagName("empty-component")).length
      ).toBe(1);
   });
});
