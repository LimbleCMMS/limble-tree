import { ViewContainerRef } from "@angular/core";

export interface NodeComponent {
   branchesContainer: ViewContainerRef | undefined;
   showInnerDropzone: boolean;
}
