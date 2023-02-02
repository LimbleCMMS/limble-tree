import { Type } from "@angular/core";

/**
 * An object that references the component to be rendered and its bindings
 * @deprecated
 */
export interface ComponentObj {
   /** The component class */
   class: Type<unknown>;
   /** The bindings (inputs and outputs) of the class */
   bindings?: {
      [index: string]: unknown;
   };
}
