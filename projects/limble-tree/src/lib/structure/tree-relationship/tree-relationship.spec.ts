import { TreeBranch } from "../tree-branch/tree-branch";
import { TreeRelationship } from "./tree-relationship";

describe("TreeRelationship", () => {
   it("should hold the parent and child passed at construction", () => {
      const parent = new TreeBranch(null);
      const child = new TreeBranch(null);
      const rel = new TreeRelationship(parent, child);
      expect(rel.getParent()).toBe(parent);
      expect(rel.getChild()).toBe(child);
   });

   it("should set the parent", () => {
      const parent = new TreeBranch(null);
      const child = new TreeBranch(null);
      const rel = new TreeRelationship(parent, child);
      const parent2 = new TreeBranch(null);
      rel.setParent(parent2);
      expect(rel.getParent()).toBe(parent2);
      expect(rel.getChild()).toBe(child);
   });
});
