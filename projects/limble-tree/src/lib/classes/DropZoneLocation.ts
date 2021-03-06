import { BranchCoordinates } from "./Branch";

export class DropZoneLocation {
   public parentCoordinates: BranchCoordinates;
   public insertIndex: number;

   constructor(parentCoordinates: BranchCoordinates, insertIndex: number) {
      this.parentCoordinates = parentCoordinates;
      this.insertIndex = insertIndex;
   }

   public getFullInsertCoordinates() {
      return [...this.parentCoordinates, this.insertIndex];
   }

   public setParentCoordinates(coordinates: BranchCoordinates) {
      this.parentCoordinates = coordinates;
   }

   public setInsertIndex(index: number) {
      this.insertIndex = index;
   }
}
