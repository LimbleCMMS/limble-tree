/** An object indicating a location within a tree */
export type BranchCoordinates = Array<number>;

export class Branch<T> {
   public data: T;
   protected children: Array<Branch<T>>;
   protected parent: Branch<unknown> | null;

   public constructor(data: T) {
      this.data = data;
      this.children = [];
      this.parent = null;
   }

   public isRoot(): boolean {
      return this.parent === null;
   }

   public getParent(): Branch<unknown> | null {
      return this.parent;
   }

   public setParent<U>(parent: Branch<U> | null) {
      this.parent = parent;
   }

   public findByCoordinates(
      relativeCoordinates: BranchCoordinates
   ): Branch<unknown> | undefined {
      let cursor: Branch<T> | undefined = this;
      for (const index of relativeCoordinates.values()) {
         cursor = cursor.getChild(index);
         if (cursor === undefined) {
            return undefined;
         }
      }
      return cursor;
   }

   public getCoordinates(): BranchCoordinates {
      const coordinates: BranchCoordinates = [];
      let cursor: Branch<unknown> = this;
      while (cursor.parent !== null) {
         const cursorIndex = cursor.getIndex();
         if (cursorIndex === undefined || cursorIndex === null) {
            throw new Error("Could not get cursor index");
         }
         coordinates.unshift(cursorIndex);
         cursor = cursor.parent;
      }
      return coordinates;
   }

   public getChild(index: number): Branch<T> | undefined {
      return this.children[index];
   }

   public getChildren(): Array<Branch<T>> {
      return this.children;
   }

   public clearChildren(): void {
      for (const child of this.children) {
         child.setParent(null);
      }
      this.children.length = 0;
   }

   public getIndex(): number | null | undefined {
      if (this.parent === null) {
         return null;
      }
      const index = this.parent.children.findIndex((branch) => branch === this);
      if (index === -1) {
         return undefined;
      }
      return index;
   }

   public getDescendant(
      relativeCoordinates: BranchCoordinates
   ): Branch<T> | undefined {
      let cursor: Branch<T> = this;
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
   ): Branch<T> | undefined {
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

   public getAncestors(): Array<Branch<unknown>> {
      const result: Array<Branch<unknown>> = [];
      let cursor: Branch<unknown> = this;
      while (cursor.parent !== null) {
         result.push(cursor.parent);
         cursor = cursor.parent;
      }
      return result;
   }

   public appendChild(child: Branch<T>): Branch<T> {
      if (child.getParent() !== null) {
         child.remove();
      }
      child.setParent(this);
      this.children.push(child);
      return child;
   }

   public insertChild(child: Branch<T>, index: number): Branch<T> {
      const isOwnChild = this.children.indexOf(child);
      if (isOwnChild === -1) {
         if (child.getParent() !== null) {
            child.remove();
         }
         child.setParent(this);
         this.children.splice(index, 0, child);
      } else {
         if (index > isOwnChild) {
            //Insert first, then remove
            this.children.splice(index, 0, child);
            this.removeChild(isOwnChild);
            child.setParent(this);
         } else {
            //remove first, then insert
            child.remove();
            this.children.splice(index, 0, child);
            child.setParent(this);
         }
      }
      return child;
   }

   public removeChild(index: number): Branch<T> {
      const target = this.children.splice(index, 1)[0];
      target.setParent(null);
      return target;
   }

   public remove(): Branch<T> {
      const index = this.getIndex();
      if (this.parent === null || index === undefined || index === null) {
         throw new Error("can't remove root");
      }
      return this.parent.removeChild(index) as Branch<T>;
   }

   public copy(): Branch<T> {
      const copy = this.copyHelper();
      copy.setParent(null);
      return copy;
   }

   protected copyHelper(): Branch<T> {
      const copy = new Branch(this.data);
      for (const child of this.children) {
         const newChild = copy.appendChild(child.copyHelper());
         newChild.parent = copy;
      }
      return copy;
   }
}
