import { Component, Input } from "@angular/core";

@Component({
   standalone: true,
   selector: "empty-component",
   template: "This is a test"
})
export class EmptyComponent {
   @Input() testInput?: string;
}
