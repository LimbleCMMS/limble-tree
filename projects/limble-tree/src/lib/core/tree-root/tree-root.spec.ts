import { first } from "rxjs";
import { TreeNode } from "../../structure/tree-node.interface";
import { TreeRoot } from "./tree-root";
import { TreeBranch } from "../tree-branch/tree-branch";
import { ViewContainerRef, ViewRef } from "@angular/core";
import { getViewContainer } from "../../test-util/virtual";
import { getStandardBranch } from "../../test-util/standard-branch";
import { EmptyComponent } from "../../test-util/empty.component";
import { createNullEvent } from "../../test-util/null-event";
import { TreeEvent } from "../../structure";
import { RootComponent } from "../../components/root/root.component";
import { TreeError } from "../../errors";
import { DestructionEvent } from "../../events/general";
import { NodeComponent } from "../../components/node-component.interface";

describe("TreeRoot", () => {
   it("should start with no branches", () => {
      const root = new TreeRoot(getViewContainer());
      expect(root.branches()).toEqual([]);
   });

   it("should immediately render a RootComponent", () => {
      const root = new TreeRoot(getViewContainer());
      expect(root.getComponentInstance()).toBeInstanceOf(RootComponent);
      const rootComponents = document.getElementsByTagName("root");
      expect(rootComponents.length).toBe(1);
   });

   it("should allow a new branch to graft itself onto the root", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      const branch = getStandardBranch();
      branch.graftTo(root);
      expect(branch.parent()).toBe(root);
      expect(root.branches()).toEqual([branch]);
      expect(
         root.getNativeElement().getElementsByTagName("branch").length
      ).toBe(1);
   });

   it("should allow multiple new branches to graft themselves onto the root", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      const branch1 = getStandardBranch();
      const branch2 = getStandardBranch();
      const branch3 = getStandardBranch();
      branch1.graftTo(root);
      branch2.graftTo(root);
      branch3.graftTo(root);
      expect(branch1.parent()).toBe(root);
      expect(branch2.parent()).toBe(root);
      expect(branch3.parent()).toBe(root);
      expect(root.branches()).toEqual([branch1, branch2, branch3]);
      const branchComponents = root
         .getNativeElement()
         .getElementsByTagName("branch");
      expect(branchComponents.length).toBe(3);
   });

   it("should get the branch at the specified index", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      const branch1 = getStandardBranch();
      const branch2 = getStandardBranch();
      const branch3 = getStandardBranch();
      branch1.graftTo(root);
      branch2.graftTo(root);
      branch3.graftTo(root);
      expect(root.getBranch(0)).toBe(branch1);
      expect(root.getBranch(1)).toBe(branch2);
      expect(root.getBranch(2)).toBe(branch3);
   });

   it("should remove branches that pruned themselves", () => {
      const branch = getStandardBranch();
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      branch.graftTo(root);
      branch.prune();
      expect(branch.parent()).not.toBe(root);
      expect(root.branches()).toEqual([]);
      const branchComponents = root
         .getNativeElement()
         .getElementsByTagName("branch");
      expect(branchComponents.length).toBe(0);
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
      const nodes: Array<TreeNode<TreeBranch<EmptyComponent>, NodeComponent>> =
         [];
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
      expect(self.getHostView()).toBe(viewContainerRef.get(0) as ViewRef);
   });

   it("should grow a child branch", () => {
      const self = new TreeRoot(getViewContainer());
      self.grow(EmptyComponent);
      expect(self.plot()).toEqual(new Map([[0, new Map()]]));
      expect(document.getElementsByTagName("branch").length).toBe(1);
      expect(document.getElementsByTagName("empty-component").length).toBe(1);
   });

   it("should destroy all descendant branches and its own RootComponent when destroyed", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      const branch1 = getStandardBranch();
      const branch2 = getStandardBranch();
      const branch3 = getStandardBranch();
      const branch3a = getStandardBranch();
      const branch3b = getStandardBranch();
      branch1.graftTo(root);
      branch2.graftTo(root);
      branch3.graftTo(root);
      branch3a.graftTo(branch3);
      branch3b.graftTo(branch3);
      root.destroy();
      expect(root.isDestroyed()).toBe(true);
      expect(branch1.isDestroyed()).toBe(true);
      expect(branch2.isDestroyed()).toBe(true);
      expect(branch3.isDestroyed()).toBe(true);
      expect(branch3a.isDestroyed()).toBe(true);
      expect(branch3b.isDestroyed()).toBe(true);
      setTimeout(() => {
         expect(document.getElementsByTagName("root").length).toBe(0);
      });
   });

   it("should throw an error when getComponentInstance is called after destruction", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      root.destroy();
      expect(() => root.getComponentInstance()).toThrowError(TreeError);
   });

   it("should throw an error when grow is called after destruction", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      root.destroy();
      expect(() => root.grow(EmptyComponent)).toThrowError(TreeError);
   });

   it("should throw an error when destroy is called after destruction", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      root.destroy();
      expect(() => {
         root.destroy();
      }).toThrowError(TreeError);
   });

   it("should return itself when root is called", () => {
      const self = new TreeRoot<EmptyComponent>(getViewContainer());
      expect(self.root()).toBe(self);
   });

   it("should dispatch a destruction event when destroyed", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      let subscriptionWasRun = false;
      root
         .events()
         .pipe(first())
         .subscribe((event) => {
            subscriptionWasRun = true;
            expect(event).toBeInstanceOf(DestructionEvent);
         });
      root.destroy();
      expect(subscriptionWasRun).toBe(true);
   });

   it("should get its own branches container", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      expect(root.getBranchesContainer()).toBeInstanceOf(ViewContainerRef);
   });

   it("should throw an error when getBranchesContainer is called after destruction", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      root.destroy();
      expect(() => root.getBranchesContainer()).toThrowError(TreeError);
   });

   it("should get its own host view", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      expect(root.getHostView()).toBeDefined();
   });

   it("should throw an error when getHostView is called after destruction", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      root.destroy();
      expect(() => root.getHostView()).toThrowError(TreeError);
   });

   it("should get the native element it is hosting", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      expect(root.getNativeElement()).toBeInstanceOf(HTMLElement);
      expect(root.getNativeElement().tagName).toBe("ROOT");
   });

   it("should throw an error when getNativeElement is called after destruction", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      root.destroy();
      expect(() => root.getNativeElement()).toThrowError(TreeError);
   });
});
