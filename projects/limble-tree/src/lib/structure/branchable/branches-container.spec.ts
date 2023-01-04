import { BranchesContainer } from "./branches-container";

describe("BranchesContainer", () => {
   it("should start with no branches", () => {
      const branches = new BranchesContainer();
      expect(branches.branches()).toEqual([]);
   });

   it("should grow branches", () => {
      const branches = new BranchesContainer<string>();
      branches.growBranch("The unit tests are documents.");
      branches.growBranch("Code, without tests, is not clean.");
      branches.growBranch(
         "No matter how elegant it is, no matter how readable and accessible, if it hath not tests, it be unclean."
      );
      expect(branches.branches()).toEqual([
         "The unit tests are documents.",
         "Code, without tests, is not clean.",
         "No matter how elegant it is, no matter how readable and accessible, if it hath not tests, it be unclean."
      ]);
   });
});
