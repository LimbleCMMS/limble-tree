export function arraysAreEqual(
   array1: Array<unknown>,
   array2: Array<unknown>
): boolean {
   if (array1.length !== array2.length) {
      return false;
   }
   for (const [index, value1] of array1.entries()) {
      const value2 = array2[index];
      if (value1 instanceof Array && value2 instanceof Array) {
         if (!arraysAreEqual(value1, value2)) {
            return false;
         }
      } else if (value1 !== value2) {
         return false;
      }
   }
   return true;
}
