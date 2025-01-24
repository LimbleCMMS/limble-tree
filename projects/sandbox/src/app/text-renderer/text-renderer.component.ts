import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TreeNodeComponent } from "../tree-node/tree-node.component";

@Component({
   selector: "text-renderer",
   templateUrl: "./text-renderer.component.html",
   styleUrls: ["./text-renderer.component.scss"],
   imports: [TreeNodeComponent]
})
export class TextRendererComponent {
   @Input() text1?: string;
   @Input() text2?: string;
   @Output() readonly textClick: EventEmitter<string>;

   public constructor() {
      this.textClick = new EventEmitter();
   }
}
