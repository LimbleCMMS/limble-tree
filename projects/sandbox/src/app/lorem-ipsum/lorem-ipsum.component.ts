import { Component } from "@angular/core";
import { TreeNodeComponent } from "../tree-node/tree-node.component";
import { loremIpsum } from "./lorem-ipsum";

@Component({
   standalone: true,
   selector: "lorem-ipsum",
   templateUrl: "./lorem-ipsum.component.html",
   styleUrls: ["./lorem-ipsum.component.scss"],
   imports: [TreeNodeComponent]
})
export class LoremIpsumComponent {
   public text?: string;

   public constructor() {
      const random = Math.floor(Math.random() * 50);
      this.text = `${loremIpsum[random]}`;
   }
}
