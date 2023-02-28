import { assert } from "../../../shared/assert";
import { filter, first, skip, take } from "rxjs";
import { GraftEvent } from "../../events/relational/graft-event";
import { PruneEvent } from "../../events/relational/prune-event";
import { TreeRoot } from "../tree-root/tree-root";
import { TreeBranch } from "./tree-branch";
import { TreeNode } from "../../structure/tree-node.interface";
import { BranchComponent } from "../../components/branch/branch.component";
import { getStandardBranch } from "../../test-util/standard-branch";
import { getViewContainer } from "../../test-util/virtual";
import { EmptyComponent } from "../../test-util/empty.component";
import { TreeError } from "../../errors/tree-error";
import { createNullEvent } from "../../test-util/null-event";
import { TreeEvent } from "../../structure";
import { DestructionEvent } from "../../events/general";

describe("TreeBranch", () => {
   it("should start with no branches", () => {
      const self = getStandardBranch();
      expect(self.branches()).toEqual([]);
   });

   it("should start with a TreeRoot as the parent", () => {
      const self = getStandardBranch();
      const parent = self.parent();
      expect(parent).toBeInstanceOf(TreeRoot);
      expect(parent?.branches()).toEqual([self]);
   });

   it("should immediately render a BranchComponent", () => {
      const root = new TreeRoot(getViewContainer());
      const branch = root.grow(EmptyComponent);
      expect(branch.getContents().componentType).toBe(BranchComponent);
      const branchComponents = root
         .getContents()
         .location.nativeElement.getElementsByTagName("branch");
      expect(branchComponents.length).toBe(1);
   });

   it("should graft onto a new parent, and allow a child branch to graft onto it", () => {
      const self = getStandardBranch();
      const parent = getStandardBranch();
      self.graftTo(parent);
      expect(self.parent()).toBe(parent);
      expect(parent.branches()).toEqual([self]);
      const childComponents = parent
         .getContents()
         .location.nativeElement.getElementsByTagName("branch");
      expect(childComponents.length).toBe(1);
   });

   it("should allow multiple child branches to graft onto it", () => {
      const parent = getStandardBranch();
      const child1 = getStandardBranch();
      const child2 = getStandardBranch();
      const child3 = getStandardBranch();
      child1.graftTo(parent);
      child2.graftTo(parent);
      child3.graftTo(parent);
      expect(child1.parent()).toBe(parent);
      expect(child2.parent()).toBe(parent);
      expect(child3.parent()).toBe(parent);
      expect(parent.branches()).toEqual([child1, child2, child3]);
      const childComponents = parent
         .getContents()
         .location.nativeElement.getElementsByTagName("branch");
      expect(childComponents.length).toBe(3);
   });

   it("should get the branch at the specified index", () => {
      const parent = getStandardBranch();
      const branch1 = parent.grow(EmptyComponent);
      const branch2 = parent.grow(EmptyComponent);
      const branch3 = parent.grow(EmptyComponent);
      expect(parent.getBranch(0)).toBe(branch1);
      expect(parent.getBranch(1)).toBe(branch2);
      expect(parent.getBranch(2)).toBe(branch3);
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
            expect(event.source()).toBe(self);
            expect(event.child()).toBe(self);
            expect(event.parent()).toBe(oldParent);
         });
      self
         .events()
         .pipe(skip(1), take(1))
         .subscribe((event) => {
            expect(event).toBeInstanceOf(GraftEvent);
            assert(event instanceof GraftEvent);
            expect(event.source()).toBe(self);
            expect(event.child()).toBe(self);
            expect(event.parent()).toBe(newParent);
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
      const nullEvent: TreeEvent = createNullEvent(gen2);
      gen2.dispatch(nullEvent);
   });

   it("should bubble events up the tree", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
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
      const nullEvent: TreeEvent = createNullEvent(gen3);
      gen3.dispatch(nullEvent);
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
      expect(child.parent()).toBe(undefined);
      expect(parent.branches()).toEqual([]);
      expect(child.index()).toBe(undefined);
      const branchComponents = parent
         .getContents()
         .location.nativeElement.getElementsByTagName("branch");
      expect(branchComponents.length).toBe(0);
   });

   it("should have no effect if pruned when already in a pruned state", () => {
      const parent = getStandardBranch();
      const child = parent.grow(EmptyComponent);
      child.prune();
      expect(() => {
         child.prune();
      }).not.toThrow();
   });

   it("should emit a PruneEvent when a branch prunes itself", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      const branch = getStandardBranch();
      branch.graftTo(root);
      let subscriptionWasRun = false;
      branch
         .events()
         .pipe(first())
         .subscribe((event) => {
            subscriptionWasRun = true;
            expect(event).toBeInstanceOf(PruneEvent);
         });
      branch.prune();
      expect(subscriptionWasRun).toBe(true);
   });

   it("should detach its userland component from the DOM when pruned", () => {
      const parent = getStandardBranch();
      const child = getStandardBranch();
      child.graftTo(parent);
      child.prune();
      expect(
         Array.from(document.getElementsByTagName("empty-component")).length
      ).toBe(0);
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
            expect(event.source()).toBe(child);
            expect(event.child()).toBe(child);
            expect(event.parent()).toBe(parent);
         });
      child.prune();
   });

   it("should hold a reference to a BranchComponent", () => {
      const self = getStandardBranch();
      expect(self.getContents().instance).toBeInstanceOf(BranchComponent);
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
      expect(() => {
         self.position();
      }).toThrowError(TreeError);
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
      const nodes: Array<TreeNode<TreeBranch<EmptyComponent>>> = [];
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

   it("should attach its view to the new parent when grafted", () => {
      const self = getStandardBranch();
      const parent = getStandardBranch();
      const container = parent.getContents().instance.branchesContainer;
      expect(container?.length).toBe(0);
      self.graftTo(parent);
      expect(container?.length).toBe(1);
      expect(
         Array.from(
            //Angular renders child views in the DOM as siblings of the view container element.
            container?.element.nativeElement.parentElement.getElementsByTagName(
               self.getContents().location.nativeElement.tagName
            )
         ).length
      ).toBe(1);
   });

   it("should grow a child branch", () => {
      const self = getStandardBranch();
      self.grow(EmptyComponent);
      expect(self.plot()).toEqual(new Map([[0, new Map()]]));
      expect(
         Array.from(document.getElementsByTagName("empty-component")).length
      ).toBe(2);
   });

   it("should grow a child branch with bindings", () => {
      const self = getStandardBranch();
      self.grow(EmptyComponent, { inputBindings: { testInput: "testing" } });
      expect(self.plot()).toEqual(new Map([[0, new Map()]]));
      expect(
         Array.from(document.getElementsByTagName("empty-component")).length
      ).toBe(2);
   });

   it("should retrieve its own root ancestor", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      const branch1 = getStandardBranch();
      const branch1a = getStandardBranch();
      const branch1b = getStandardBranch();
      const branch2 = getStandardBranch();
      const branch3 = getStandardBranch();
      const branch3a = getStandardBranch();
      const branch3a1 = getStandardBranch();
      const branch3a2 = getStandardBranch();
      const branch3b = getStandardBranch();
      branch1.graftTo(root);
      branch2.graftTo(root);
      branch3.graftTo(root);
      branch1a.graftTo(branch1);
      branch1b.graftTo(branch1);
      branch3a.graftTo(branch3);
      branch3b.graftTo(branch3);
      branch3a1.graftTo(branch3a);
      branch3a2.graftTo(branch3a);
      expect(branch3a2.root()).toBe(root);
      expect(branch3a1.root()).toBe(root);
      expect(branch3a.root()).toBe(root);
      expect(branch2.root()).toBe(root);
   });

   it("should return undefined when root is called on a pruned branch", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      const branch1 = getStandardBranch();
      const branch1a = getStandardBranch();
      const branch1b = getStandardBranch();
      const branch2 = getStandardBranch();
      const branch3 = getStandardBranch();
      const branch3a = getStandardBranch();
      const branch3a1 = getStandardBranch();
      const branch3a2 = getStandardBranch();
      const branch3b = getStandardBranch();
      branch1.graftTo(root);
      branch2.graftTo(root);
      branch3.graftTo(root);
      branch1a.graftTo(branch1);
      branch1b.graftTo(branch1);
      branch3a.graftTo(branch3);
      branch3b.graftTo(branch3);
      branch3a1.graftTo(branch3a);
      branch3a2.graftTo(branch3a);
      branch3.prune();
      expect(branch3a2.root()).toBe(undefined);
      expect(branch3a1.root()).toBe(undefined);
      expect(branch3a.root()).toBe(undefined);
      expect(branch2.root()).toBe(root);
   });

   it("should destroy all descendant branches and its own BranchComponent when destroyed", () => {
      const root = new TreeRoot<EmptyComponent>(getViewContainer());
      const branch1 = root.grow(EmptyComponent);
      const branch2 = root.grow(EmptyComponent);
      const branch3 = root.grow(EmptyComponent);
      const branch3a = branch3.grow(EmptyComponent);
      const branch3b = branch3.grow(EmptyComponent);
      const branch3b1 = branch3b.grow(EmptyComponent);
      branch3.destroy();
      expect(root.isDestroyed()).toBe(false);
      expect(branch1.isDestroyed()).toBe(false);
      expect(branch2.isDestroyed()).toBe(false);
      expect(branch3.isDestroyed()).toBe(true);
      expect(branch3a.isDestroyed()).toBe(true);
      expect(branch3b.isDestroyed()).toBe(true);
      expect(branch3b1.isDestroyed()).toBe(true);
      setTimeout(() => {
         expect(
            root
               .getContents()
               .location.nativeElement.getElementsByTagName("branch").length
         ).toBe(2);
      });
   });

   it("should throw an error when getContents is called after destruction", () => {
      const branch = getStandardBranch();
      branch.destroy();
      expect(() => branch.getContents()).toThrowError(TreeError);
   });

   it("should throw an error when grow is called after destruction", () => {
      const branch = getStandardBranch();
      branch.destroy();
      expect(() => branch.grow(EmptyComponent)).toThrowError(TreeError);
   });

   it("should throw an error when destroy is called after destruction", () => {
      const branch = getStandardBranch();
      branch.destroy();
      expect(() => {
         branch.destroy();
      }).toThrowError(TreeError);
   });

   it("should throw an error when graftTo is called after destruction", () => {
      const branch = getStandardBranch();
      const parent = getStandardBranch();
      branch.destroy();
      expect(() => {
         branch.graftTo(parent);
      }).toThrowError(TreeError);
   });

   it("should throw an error when grafting to a destroyed parent", () => {
      const branch = getStandardBranch();
      const parent = getStandardBranch();
      parent.destroy();
      expect(() => {
         branch.graftTo(parent);
      }).toThrowError(TreeError);
   });

   it("should throw an error when prune is called after destruction", () => {
      const branch = getStandardBranch();
      branch.destroy();
      expect(() => {
         branch.prune();
      }).toThrowError(TreeError);
   });

   //FIXME: Any more methods that should fail after destruction?

   it("should dispatch a destruction event when destroyed", () => {
      const self = getStandardBranch();
      let subscriptionWasRun = false;
      self
         .events()
         .pipe(
            filter((event) => event instanceof DestructionEvent),
            first()
         )
         .subscribe((event) => {
            subscriptionWasRun = true;
            expect(event).toBeInstanceOf(DestructionEvent);
         });
      self.destroy();
      expect(subscriptionWasRun).toBe(true);
   });

   it("should return an empty object as the meta data by default", () => {
      const branch = getStandardBranch();
      expect(branch.meta()).toEqual({});
   });

   it("should return user-defined meta data, maintaining object reference", () => {
      const metaData = { test: "testing" };
      const branch = new TreeBranch<EmptyComponent>(
         new TreeRoot<EmptyComponent>(getViewContainer()),
         {
            component: EmptyComponent,
            meta: metaData
         }
      );
      expect(branch.meta()).toBe(metaData);
   });
});
