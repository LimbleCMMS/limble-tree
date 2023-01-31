import { Type } from "@angular/core";

export interface BranchOptions<Component> {
   bindings?: {
      [K in keyof Component]?: Component[K];
   };
}

export interface FullBranchOptions<Component extends Type<unknown>>
   extends BranchOptions<Component> {
   component: Component;
}
