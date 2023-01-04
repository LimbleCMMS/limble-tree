import { Branchable } from "./branchable.interface";

export class BranchesContainer<T> implements Branchable<T> {
   private readonly _branches: Array<T>;

   public constructor() {
      this._branches = [];
   }

   public branches(): Array<T> {
      return [...this._branches];
   }

   public delete(index?: number): void {
      if (index === undefined) {
         this._branches.pop();
         return;
      }
      this._branches.splice(index, 1);
   }

   public growBranch(branchContent: T, index?: number): void {
      if (index === undefined) {
         this._branches.push(branchContent);
         return;
      }
      this._branches.splice(index, 0, branchContent);
   }
}
