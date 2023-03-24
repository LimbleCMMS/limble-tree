import { Component, OnInit } from "@angular/core";

@Component({
   selector: "error-init",
   template: "This is a test"
})
export class ErrorInitComponent implements OnInit {
   public ngOnInit(): void {
      throw new Error("This is a test error");
   }
}
