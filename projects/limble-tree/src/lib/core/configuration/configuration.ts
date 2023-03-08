import type { TreeRoot } from "../tree-root/tree-root";
import type { TreeOptions } from "./tree-options.interface";

class Configuration {
   private readonly configStorage = new Map<TreeRoot<any>, TreeOptions>();

   public constructor() {
      this.configStorage = new Map();
   }

   public setConfig<T>(root: TreeRoot<T>, options: TreeOptions): void {
      this.configStorage.set(root, options);
   }

   public getConfig(root: any): TreeOptions | undefined {
      return this.configStorage.get(root);
   }

   public delete(root: any): void {
      this.configStorage.delete(root);
   }
}

export const config = new Configuration();
