import { Component, input, Input } from "@angular/core";

@Component({
   standalone: true,
   selector: "empty-component",
   template: "This is a test"
})
export class EmptyComponent {
   @Input() testInput?: string;
   treeBranch = input.required();
}
