import { Component, Input } from "@angular/core";
import { TreeBranch } from "@limble/limble-tree";

@Component({
   selector: "draggable",
   templateUrl: "./draggable.component.html",
   styleUrls: ["./draggable.component.scss"]
})
export class DraggableComponent {
   @Input() treeBranch?: TreeBranch<DraggableComponent>;
}
