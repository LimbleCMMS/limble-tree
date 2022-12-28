import { RootComponent } from "../../components/root/root.component";
import { TreeRoot } from "../../structure/tree-root/tree-root";
import { TreeError } from "../errors/tree-error";
import { NodeRef } from "../node-ref";
import { getViewContainer } from "../test-util/view-container";
import { Tree } from "../tree/tree";
import { TreeCursor } from "./tree-cursor";

describe("TreeCursor", () => {
   it("should start at a root node", () => {
      const cursor = getStandardCursor();
      expect(cursor.atRoot()).toBe(true);
   });

   it("should start at root position", () => {
      const cursor = getStandardCursor();
      expect(cursor.position()).toEqual([]);
   });

   it("should get its container tree", () => {
      const nodeRef = getViewContainer().createComponent(RootComponent);
      const root = new TreeRoot<NodeRef>(nodeRef);
      const tree = new Tree(root);
      const cursor = tree.getCursor();
      expect(cursor.tree()).toBe(tree);
   });

   it("should create a new branch at the target", () => {
      const cursor = getStandardCursor();
      const index = cursor.growBranch();
      expect(index).toBe(0);
   });

   it("should move to specified child branch", () => {
      const cursor = getStandardCursor();
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepIn(1);
      expect(cursor.position()).toEqual([1]);
   });

   it("should move to first child when no index is specified", () => {
      const cursor = getStandardCursor();
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepIn();
      expect(cursor.position()).toEqual([0]);
   });

   it("should throw a TreeError when stepping into a child that doesn't exist", () => {
      const cursor = getStandardCursor();
      expect(() => {
         cursor.stepIn();
      }).toThrowError(TreeError);
   });

   it("should move to parent", () => {
      const cursor = getStandardCursor();
      cursor.growBranch();
      cursor.stepIn();
      cursor.stepOut();
      expect(cursor.position()).toEqual([]);
   });

   it("should do nothing when attempting to step out of the root", () => {
      const cursor = getStandardCursor();
      cursor.stepOut();
      expect(cursor.atRoot()).toBe(true);
   });

   it("should move to next sibling", () => {
      const cursor = getStandardCursor();
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepIn();
      cursor.stepForward();
      expect(cursor.position()).toEqual([1]);
   });

   it("should do nothing when attempting to step forward from root", () => {
      const cursor = getStandardCursor();
      cursor.stepForward();
      expect(cursor.atRoot()).toBe(true);
   });

   it("should move back to parent when attempting to step forward from the last sibling", () => {
      const cursor = getStandardCursor();
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepIn();
      cursor.stepForward();
      cursor.stepForward();
      expect(cursor.position()).toEqual([]);
   });

   it("should prune a branch, creating a new tree", () => {
      const nodeRef = getViewContainer().createComponent(RootComponent);
      nodeRef.changeDetectorRef.detectChanges();
      const root = new TreeRoot<NodeRef>(nodeRef);
      const tree = new Tree(root);
      const cursor = tree.getCursor();
      cursor.growBranch();
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepIn();
      cursor.growBranch();
      cursor.growBranch();
      const newTree = cursor.prune();
      expect(newTree).not.toBe(tree);
      expect(cursor.position()).toEqual([0]);
      expect(cursor.tree()).toBe(newTree);
      expect(newTree.plot()).toEqual(
         new Map([
            [
               0,
               new Map([
                  [0, new Map()],
                  [1, new Map()]
               ])
            ]
         ])
      );
      cursor.stepOut();
      expect(tree.plot()).toEqual(
         new Map([
            [0, new Map()],
            [1, new Map()]
         ])
      );
   });

   it("should step back to the previous sibling", () => {
      const cursor = getStandardCursor();
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepIn();
      cursor.stepForward();
      cursor.stepBackward();
      expect(cursor.position()).toEqual([0]);
   });

   it("should do nothing when attempting to step backward from root", () => {
      const cursor = getStandardCursor();
      cursor.stepBackward();
      expect(cursor.atRoot()).toBe(true);
   });

   it("should move back to parent when attempting to step back from the first sibling", () => {
      const cursor = getStandardCursor();
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepIn(1);
      cursor.stepBackward();
      cursor.stepBackward();
      expect(cursor.position()).toEqual([]);
   });
});

function getStandardCursor(): TreeCursor {
   const nodeRef = getViewContainer().createComponent(RootComponent);
   nodeRef.changeDetectorRef.detectChanges();
   const root = new TreeRoot<NodeRef>(nodeRef);
   const tree = new Tree(root);
   return tree.getCursor();
}
