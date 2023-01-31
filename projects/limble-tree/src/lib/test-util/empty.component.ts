import { Component, Input } from "@angular/core";

@Component({
   selector: "empty-component",
   template: "This is a test"
})
export class EmptyComponent {
   @Input() testInput?: string;
}
