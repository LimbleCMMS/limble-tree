import { TestBed } from "@angular/core/testing";
import { first } from "rxjs";
import { RootComponent } from "../../components/root/root.component";
import { TreeEvent } from "../../events/tree-event.interface";
import { TreeNode } from "../../structure/nodes/tree-node.interface";
import { VirtualComponent } from "../../components/virtual-component/virtual.component";
import { TreeBranch } from "../tree-branch/tree-branch";
import { VirtualTreeRoot } from "./virtual-tree-root";
import { getVirtualComponent } from "../../test-util/virtual";
import { getStandardBranch } from "../../test-util/standard-branch";

describe("VirtualTreeRoot", () => {
   TestBed.configureTestingModule({
      declarations: [VirtualComponent]
   });

   it("should start with no branches", () => {
      const root = new VirtualTreeRoot(getVirtualComponent());
      expect(root.branches()).toEqual([]);
   });

   it("should allow new branches to graft themselves onto it", () => {
      const branch = getStandardBranch();
      const root = new VirtualTreeRoot(getVirtualComponent());
      branch.graftTo(root);
      expect(branch.parent()).toBe(root);
      expect(root.branches()).toEqual([branch]);
   });

   it("should remove branches that pruned themselves", () => {
      const branch = getStandardBranch();
      const root = new VirtualTreeRoot(getVirtualComponent());
      branch.graftTo(root);
      branch.prune();
      expect(branch.parent()).not.toBe(root);
      expect(root.branches()).toEqual([]);
   });

   it("should emit any events it receives from descendants", () => {
      const gen1 = new VirtualTreeRoot(getVirtualComponent());
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
      const root = new VirtualTreeRoot(getVirtualComponent());
      root
         .events()
         .pipe(first())
         .subscribe((event) => {
            expect(event).toBe(nullEvent);
         });
      const nullEvent: TreeEvent = { source: () => root };
      root.dispatch(nullEvent);
   });

   it("should start with an empty plot", () => {
      const self = new VirtualTreeRoot(getVirtualComponent());
      expect(self.plot()).toEqual(new Map());
   });

   it("should plot itself and its posterity", () => {
      const root = new VirtualTreeRoot(getVirtualComponent());
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
      const root = new VirtualTreeRoot(getVirtualComponent());
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

   it("Should have a componentRef whose component is rendered outside of the DOM", () => {
      const self = new VirtualTreeRoot(getVirtualComponent());
      expect(self.getContents().instance).toBeInstanceOf(RootComponent);
      expect(document.querySelector("RootComponent")).toBe(null);
   });
});
