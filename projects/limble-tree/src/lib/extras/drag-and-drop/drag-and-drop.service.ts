import { Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import type { TreeBranch, TreeRoot } from "../../core";
import { dragState, DragStates } from "./drag-state";
import { dropzoneRenderer } from "./dropzone-renderer";

@Injectable()
export class TreeDragAndDropService {
   /** Hides all Dropzones */
   public clearDropzones(): void {
      dropzoneRenderer.clearCurrentDisplay();
   }

   /**
    * Returns an object that indicates which dropzones are currently being displayed.
    * If no dropzones are being displayed, then null is returned.
    */
   public getCurrentlyDisplayedDropzoneFamily(): {
      treeBranch: TreeRoot<any> | TreeBranch<any>;
      direction: "upper" | "lower";
   } | null {
      return dropzoneRenderer.getCurrentDisplay();
   }

   /**
    * Causes the dropzone of the TreeRoot to be displayed. This is a useful function
    * when you want to show the dropzone of a TreeRoot that has no child branches.
    */
   public showRootDropzone<T>(root: TreeRoot<T>): void {
      dropzoneRenderer.showLowerZones(root);
   }

   /**
    * Returns an observable that emits a number whenever the drag state changes.
    * See the `DragStates` enum for a list of possible states.
    */
   public state(): Observable<DragStates> {
      return dragState.events();
   }
}
