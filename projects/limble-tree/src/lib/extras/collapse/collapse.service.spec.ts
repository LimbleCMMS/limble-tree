import { TreeRoot } from "../../core";
import { EmptyComponent, getViewContainer } from "../../test-util";
import { TreeCollapseService } from "./collapse.service";

describe("TreeCollapseService", () => {
   it("should remove children from the tree when `collapse` is called, and then replace them in the same place when `expand` is called", () => {
      const root = new TreeRoot(getViewContainer());
      const collapseService = new TreeCollapseService();
      root.grow(EmptyComponent);
      const target = root.grow(EmptyComponent);
      root.grow(EmptyComponent);
      target.grow(EmptyComponent);
      const child2 = target.grow(EmptyComponent);
      target.grow(EmptyComponent);
      child2.grow(EmptyComponent);
      const child2b = child2.grow(EmptyComponent);
      child2.grow(EmptyComponent);
      child2b.grow(EmptyComponent);
      expect(root.plot()).toEqual(
         new Map([
            [0, new Map()],
            [
               1, // `target`
               new Map([
                  [0, new Map()],
                  [
                     1, // `child2`
                     new Map([
                        [0, new Map()],
                        [1, new Map([[0, new Map()]])],
                        [2, new Map()]
                     ])
                  ],
                  [2, new Map()]
               ])
            ],
            [2, new Map()]
         ])
      );
      collapseService.collapse(target);
      expect(root.plot()).toEqual(
         new Map([
            [0, new Map()],
            [1, new Map()],
            [2, new Map()]
         ])
      );
      collapseService.expand(target);
      expect(root.plot()).toEqual(
         new Map([
            [0, new Map()],
            [
               1, // `target`
               new Map([
                  [0, new Map()],
                  [
                     1, // `child2`
                     new Map([
                        [0, new Map()],
                        [1, new Map([[0, new Map()]])],
                        [2, new Map()]
                     ])
                  ],
                  [2, new Map()]
               ])
            ],
            [2, new Map()]
         ])
      );
   });

   it("should do nothing if `expand` is called before `collapse` for a particular branch", () => {
      const root = new TreeRoot(getViewContainer());
      const collapseService = new TreeCollapseService();
      root.grow(EmptyComponent);
      const target = root.grow(EmptyComponent);
      root.grow(EmptyComponent);
      target.grow(EmptyComponent);
      const child2 = target.grow(EmptyComponent);
      target.grow(EmptyComponent);
      child2.grow(EmptyComponent);
      const child2b = child2.grow(EmptyComponent);
      child2.grow(EmptyComponent);
      child2b.grow(EmptyComponent);
      collapseService.expand(target);
      expect(root.plot()).toEqual(
         new Map([
            [0, new Map()],
            [
               1, // `target`
               new Map([
                  [0, new Map()],
                  [
                     1, // `child2`
                     new Map([
                        [0, new Map()],
                        [1, new Map([[0, new Map()]])],
                        [2, new Map()]
                     ])
                  ],
                  [2, new Map()]
               ])
            ],
            [2, new Map()]
         ])
      );
   });

   it("should do nothing if `collapse` is called when the branch has no children", () => {
      const root = new TreeRoot(getViewContainer());
      const collapseService = new TreeCollapseService();
      root.grow(EmptyComponent);
      const target = root.grow(EmptyComponent);
      root.grow(EmptyComponent);
      target.grow(EmptyComponent);
      const child2 = target.grow(EmptyComponent);
      target.grow(EmptyComponent);
      const child2a = child2.grow(EmptyComponent);
      const child2b = child2.grow(EmptyComponent);
      child2.grow(EmptyComponent);
      child2b.grow(EmptyComponent);
      expect(root.plot()).toEqual(
         new Map([
            [0, new Map()],
            [
               1, // `target`
               new Map([
                  [0, new Map()],
                  [
                     1, // `child2`
                     new Map([
                        [0, new Map()],
                        [1, new Map([[0, new Map()]])],
                        [2, new Map()]
                     ])
                  ],
                  [2, new Map()]
               ])
            ],
            [2, new Map()]
         ])
      );
      collapseService.collapse(target);
      expect(root.plot()).toEqual(
         new Map([
            [0, new Map()],
            [1, new Map()],
            [2, new Map()]
         ])
      );
      collapseService.collapse(target);
      expect(root.plot()).toEqual(
         new Map([
            [0, new Map()],
            [1, new Map()],
            [2, new Map()]
         ])
      );
      collapseService.collapse(child2a);
      expect(root.plot()).toEqual(
         new Map([
            [0, new Map()],
            [1, new Map()],
            [2, new Map()]
         ])
      );
      collapseService.expand(target);
      expect(root.plot()).toEqual(
         new Map([
            [0, new Map()],
            [
               1, // `target`
               new Map([
                  [0, new Map()],
                  [
                     1, // `child2`
                     new Map([
                        [0, new Map()],
                        [1, new Map([[0, new Map()]])],
                        [2, new Map()]
                     ])
                  ],
                  [2, new Map()]
               ])
            ],
            [2, new Map()]
         ])
      );
   });

   it("should determine whether a branch is currently collapsed", () => {
      const root = new TreeRoot(getViewContainer());
      const collapseService = new TreeCollapseService();
      root.grow(EmptyComponent);
      const target = root.grow(EmptyComponent);
      root.grow(EmptyComponent);
      target.grow(EmptyComponent);
      const child2 = target.grow(EmptyComponent);
      target.grow(EmptyComponent);
      child2.grow(EmptyComponent);
      const child2b = child2.grow(EmptyComponent);
      child2.grow(EmptyComponent);
      child2b.grow(EmptyComponent);
      collapseService.collapse(target);
      collapseService.collapse(child2b);
      expect(collapseService.isCollapsed(target)).toBe(true);
      expect(collapseService.isCollapsed(child2b)).toBe(true);
      expect(collapseService.isCollapsed(child2)).toBe(false);
   });
});
