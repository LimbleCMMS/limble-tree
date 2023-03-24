import { Component } from "@angular/core";

@Component({
   selector: "error-constructor",
   template: "This is a test"
})
export class ErrorConstructorComponent {
   public constructor() {
      throw new Error("This is a test error");
   }
}
