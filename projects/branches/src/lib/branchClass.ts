/** An object indicating a location within a tree */
export type BranchCoordinates = Array<number>;

// //eslint-disable-next-line @typescript-eslint/no-empty-interface -- For clarity of naming
// interface Branch<T> extends BranchClass<T>{}

export interface BranchConstructor {
   new <T>(data: T): BranchClass<T>;
   new (data?: undefined): BranchClass<undefined>;
}

export class BranchClass<T> {
   public data: T;
   private children: Array<BranchClass<T>>;
   private parent: BranchClass<unknown> | null;

   public constructor(data: T) {
      this.data = data;
      this.children = [];
      this.parent = null;
   }

   public isRoot() {
      return this.parent === null;
   }

   public getParent() {
      return this.parent;
   }

   public setParent<U>(parent: BranchClass<U> | null) {
      this.parent = parent;
   }

   public getCoordinates() {
      const coordinates: BranchCoordinates = [];
      let cursor: BranchClass<unknown> = this;
      while (cursor.parent !== null) {
         const cursorIndex = cursor.getIndex();
         if (cursorIndex === undefined) {
            throw new Error("Unreachable error"); //This should be impossible to hit
         }
         coordinates.unshift(cursorIndex);
         cursor = cursor.parent;
      }
      return coordinates;
   }

   public getChild(index: number): BranchClass<T> | undefined {
      return this.children[index];
   }

   public getIndex(): number | undefined {
      return (
         this.parent?.children.findIndex((branch) => branch === this) ??
         undefined
      );
   }

   public getDescendant(
      relativeCoordinates: BranchCoordinates
   ): BranchClass<T> | undefined {
      let cursor: BranchClass<T> = this;
      for (const index of relativeCoordinates) {
         cursor = cursor.children[index];
         if (cursor === undefined) {
            return undefined;
         }
      }
      return cursor;
   }

   public findDescendant(
      predicate: (data: T) => boolean
   ): BranchClass<T> | undefined {
      if (predicate(this.data) === true) {
         return this;
      }
      if (this.children.length > 0) {
         for (const child of this.children) {
            const foundDeeper = child.findDescendant(predicate);
            if (foundDeeper !== undefined) {
               return foundDeeper;
            }
         }
      }
      return undefined;
   }

   public appendChild(child: BranchClass<T>): BranchClass<T> {
      child.setParent(this);
      this.children.push(child);
      return child;
   }

   public insertChild(child: BranchClass<T>, index: number): BranchClass<T> {
      child.setParent(this);
      this.children.splice(index, 0, child);
      return child;
   }

   public removeChild(index: number): BranchClass<T> {
      return this.children.splice(index, 1)[0];
   }

   public remove(): BranchClass<T> {
      const index = this.getIndex();
      if (this.parent === null || index === undefined) {
         throw new Error("can't remove root");
      }
      return this.parent.removeChild(index) as BranchClass<T>;
   }
}
