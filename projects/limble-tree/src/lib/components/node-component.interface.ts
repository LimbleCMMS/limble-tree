import type { ViewContainerRef } from "@angular/core";

export interface NodeComponent {
   branchesContainer: ViewContainerRef | undefined;
   showInnerDropzone: boolean;
}
