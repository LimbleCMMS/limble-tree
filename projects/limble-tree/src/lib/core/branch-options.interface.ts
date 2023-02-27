import { EventEmitter, Type } from "@angular/core";

export interface BranchOptions<Component> {
   inputBindings?: {
      [K in keyof Component]?: Component[K];
   };
   outputBindings?: {
      [K in keyof Component]?: Component[K] extends EventEmitter<infer T>
         ? (value: T) => void
         : never;
   };
   startCollapsed?: boolean;
   meta?: Record<string, any>;
}

export interface FullBranchOptions<Component> extends BranchOptions<Component> {
   component: Type<Component>;
}
