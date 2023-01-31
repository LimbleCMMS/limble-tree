import { Component } from "@angular/core";
import { loremIpsum } from "./lorem-ipsum";

@Component({
   selector: "lorem-ipsum",
   templateUrl: "./lorem-ipsum.component.html",
   styleUrls: ["./lorem-ipsum.component.scss"]
})
export class LoremIpsumComponent {
   public text?: string;

   public constructor() {
      const random = Math.floor(Math.random() * 50);
      this.text = `${loremIpsum[random]}`;
   }
}
