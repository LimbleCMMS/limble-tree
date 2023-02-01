import { TreeRoot } from "../tree-root/tree-root";
import { TreeOptions } from "./tree-options.interface";

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
}

export const config = new Configuration();
