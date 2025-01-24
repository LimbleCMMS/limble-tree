import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { TreeBranch, TreeDragAndDropModule } from "@limble/limble-tree";
import { TreeNodeComponent } from "../tree-node/tree-node.component";

@Component({
    selector: "draggable",
    templateUrl: "./draggable.component.html",
    styleUrls: ["./draggable.component.scss"],
    imports: [TreeDragAndDropModule, TreeNodeComponent, MatButtonModule]
})
export class DraggableComponent {
   @Input() treeBranch?: TreeBranch<DraggableComponent>;
}
