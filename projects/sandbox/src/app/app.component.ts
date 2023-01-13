import {
   AfterViewInit,
   Component,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { TreeService } from "@limble/limble-tree";
import { LoremIpsumComponent } from "./lorem-ipsum/lorem-ipsum.component";

@Component({
   selector: "app-root",
   templateUrl: "./app.component.html",
   styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit {
   @ViewChild("treeContainer", { read: ViewContainerRef })
   treeContainer?: ViewContainerRef;

   public readonly title = "Limble Tree Sandbox";

   // private readonly treeSizeMinimum = 1000;
   // private readonly branchOptions: BranchOptions<LoremIpsumComponent> = {
   //    component: LoremIpsumComponent
   // };

   public constructor(private readonly treeService: TreeService) {}

   public ngAfterViewInit(): void {
      if (this.treeContainer === undefined) {
         throw new Error("cannot get tree container");
      }
      const tree = this.treeService.createTree(this.treeContainer);
      console.log(tree);
   }
}
