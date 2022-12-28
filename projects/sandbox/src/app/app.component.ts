import {
   AfterViewInit,
   Component,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { TreeService } from "@limble/limble-tree";

@Component({
   selector: "app-root",
   templateUrl: "./app.component.html",
   styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit {
   @ViewChild("treeContainer", { read: ViewContainerRef })
   treeContainer?: ViewContainerRef;
   title = "Limble Tree Sandbox";

   public constructor(private readonly treeService: TreeService) {}

   public ngAfterViewInit(): void {
      if (this.treeContainer === undefined) {
         throw new Error("cannot get tree container");
      }
      const tree = this.treeService.createTree(this.treeContainer);
      const cursor = tree.getCursor();
      cursor.growBranch();
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepIn(0);
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepOut();
      cursor.stepIn(2);
      cursor.growBranch();
      cursor.growBranch();
      cursor.stepIn();
      cursor.growBranch();
      cursor.stepIn();
      cursor.growBranch();
   }
}
