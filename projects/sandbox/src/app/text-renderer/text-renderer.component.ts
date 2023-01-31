import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
   selector: "text-renderer",
   templateUrl: "./text-renderer.component.html",
   styleUrls: ["./text-renderer.component.scss"]
})
export class TextRendererComponent {
   @Input() text1?: string;
   @Input() text2?: string;
   @Output() readonly textClick: EventEmitter<string>;

   public constructor() {
      this.textClick = new EventEmitter();
   }
}
