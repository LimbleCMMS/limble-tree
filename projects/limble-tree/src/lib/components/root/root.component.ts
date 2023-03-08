import { CommonModule } from "@angular/common";
import {
   AfterViewInit,
   Component,
   EventEmitter,
   Output,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { assert } from "../../../shared/assert";
import { DropzoneComponent } from "../dropzone/dropzone.component";
import { NodeComponent } from "../node-component.interface";

@Component({
   standalone: true,
   selector: "root",
   templateUrl: "./root.component.html",
   styleUrls: ["./root.component.scss"],
   imports: [CommonModule, DropzoneComponent]
})
export class RootComponent implements NodeComponent, AfterViewInit {
   @ViewChild("branchesContainer", { read: ViewContainerRef })
   branchesContainer: ViewContainerRef | undefined = undefined;
   @ViewChild(DropzoneComponent) dropzone: DropzoneComponent | undefined =
      undefined;

   @Output() readonly afterViewInit = new EventEmitter<void>();
   @Output() readonly dropped = new EventEmitter<void>();

   public showInnerDropzone: boolean = false;

   public ngAfterViewInit(): void {
      this.afterViewInit.emit();
      assert(this.dropzone !== undefined);
      this.dropzone.dropped.subscribe(this.dropped);
   }
}
