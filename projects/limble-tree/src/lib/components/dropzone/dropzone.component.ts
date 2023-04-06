import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DragoverNoChangeDetectDirective } from "../dragover-no-change-detect";

@Component({
   standalone: true,
   selector: "dropzone",
   templateUrl: "./dropzone.component.html",
   styleUrls: ["./dropzone.component.scss"],
   imports: [CommonModule, DragoverNoChangeDetectDirective]
})
export class DropzoneComponent {
   @Input() placement?: "inner" | "lateral";
   @Output() readonly dropped = new EventEmitter<DragEvent>();

   protected active: boolean = false;

   public dragenterHandler(): void {
      this.active = true;
   }

   public dragleaveHandler(): void {
      this.active = false;
   }

   public dragoverHandler(event: DragEvent): void {
      event.preventDefault();
      (event.dataTransfer as DataTransfer).dropEffect = "move";
   }

   public dropHandler(event: DragEvent): void {
      this.dropped.emit(event);
   }
}
