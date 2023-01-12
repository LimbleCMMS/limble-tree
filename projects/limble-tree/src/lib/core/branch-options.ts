import { Type } from "@angular/core";

export type BranchOptions<T = unknown> = {
   component: Type<T>;
};
