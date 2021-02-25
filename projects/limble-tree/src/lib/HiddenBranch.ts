import { Branch, BranchCoordinates } from "./Branch";

function fromBranchHelper<G>(branch: Branch<G>) {
   const copy = new HiddenBranch(branch.data);
   for (const child of branch.getChildren()) {
      const newChild = copy.appendChild(HiddenBranch.fromBranch(child));
      newChild.setParent(copy);
   }
   return copy;
}

export class HiddenBranch<T> extends Branch<T> {
   public static fromBranch<G>(branch: Branch<G>): HiddenBranch<G> {
      const copy = fromBranchHelper(branch);
      copy.setParent(null);
      return copy;
   }

   private hidden: boolean;
   protected children: Array<HiddenBranch<T>>;
   private hiddenChildren: Map<number, HiddenBranch<any>>;
   protected parent: HiddenBranch<unknown> | null;

   constructor(data: T, hidden = false) {
      super(data);
      this.hidden = hidden;
      this.hiddenChildren = new Map<number, HiddenBranch<any>>();
      this.children = [];
      this.parent = null;
   }

   public getHiddenChild(index: number): HiddenBranch<any> | undefined {
      return this.hiddenChildren.get(index);
   }

   public getParent() {
      return this.parent;
   }

   public addHiddenChild(
      child: HiddenBranch<any>,
      index: number
   ): HiddenBranch<any> {
      this.hiddenChildren.set(index, child);
      child.setHidden(true);
      child.setParent(this);
      return child;
   }

   public findByCoordinates(
      relativeCoordinates: BranchCoordinates,
      hidden = false
   ): HiddenBranch<T> {
      let cursor: HiddenBranch<T> = this;
      for (const [key, index] of relativeCoordinates.entries()) {
         let temp: HiddenBranch<T> | undefined;
         if (key === relativeCoordinates.length - 1 && hidden === true) {
            temp = cursor.getHiddenChild(index);
         } else {
            temp = cursor.getChild(index);
         }
         if (temp === undefined) {
            throw new Error("Failed to get child. Coordinates are bad.");
         }
         cursor = temp;
      }
      return cursor;
   }

   public getChild(index: number): HiddenBranch<T> | undefined {
      return this.children[index];
   }

   public getIndex(): number | undefined {
      if (this.parent === null) {
         return undefined;
      }
      if (this.hidden === false) {
         const index = this.parent.children.findIndex(
            (branch) => branch === this
         );
         if (index === -1) {
            return undefined;
         }
         return index;
      } else {
         for (const [key, value] of this.parent.hiddenChildren.entries()) {
            if (value === this) {
               return key;
            }
         }
         return undefined;
      }
   }

   public setHidden(bool: boolean) {
      this.hidden = bool;
   }

   public isHidden(): boolean {
      return this.hidden;
   }

   public copy(): HiddenBranch<T> {
      const copy = this.copyHelper();
      copy.setParent(null);
      return copy;
   }

   protected copyHelper(): HiddenBranch<T> {
      const copy = super.copyHelper() as HiddenBranch<T>;
      for (const [key, hiddenChild] of this.hiddenChildren.entries()) {
         const newHiddenChild = copy.addHiddenChild(
            hiddenChild.copyHelper(),
            key
         );
         newHiddenChild.parent = copy;
      }
      return copy;
   }
}
