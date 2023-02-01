import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TreeBranch, TreeRoot } from "../../core";
import { dragAndDrop } from "./drag-and-drop";
import { dragState, DragStates } from "./drag-state";
import { dropzoneRenderer } from "./dropzone-renderer";

@Injectable()
export class TreeDragAndDropService {
   public dragStart<T>(treeBranch: TreeBranch<T>, event: DragEvent): void {
      dragAndDrop.dragStart(treeBranch, event);
   }

   public showRootDropzone<T>(root: TreeRoot<T>): void {
      dropzoneRenderer.showLowerZones(root);
   }

   public state(): Observable<DragStates> {
      return dragState.events();
   }
}
