import { Component } from "@angular/core";

@Component({
   standalone: true,
   selector: "error-constructor",
   template: "This is a test"
})
export class ErrorConstructorComponent {
   public constructor() {
      throw new Error("This is a test error");
   }
}
