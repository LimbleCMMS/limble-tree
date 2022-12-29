import {
   AfterViewInit,
   Component,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import {
   BranchOptions,
   Tree,
   TreeCursor,
   TreeService
} from "@limble/limble-tree";
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

   private tree?: Tree;
   private readonly treeSizeMinimum = 1000;
   private readonly branchOptions: BranchOptions<LoremIpsumComponent> = {
      component: LoremIpsumComponent
   };

   public constructor(private readonly treeService: TreeService) {}

   public ngAfterViewInit(): void {
      if (this.treeContainer === undefined) {
         throw new Error("cannot get tree container");
      }
      this.tree = this.treeService.createTree(this.treeContainer);
      const cursor = this.tree.getCursor();
      this.buildTree(cursor);
      // setTimeout(() => {
      //    cursor.jumpTo([0]);
      //    const pruned = cursor.prune();
      //    setTimeout(() => {
      //       cursor.graftAt(0, pruned);
      //    }, 3000);
      // }, 3000);
   }

   private buildTree(cursor: TreeCursor) {
      if (this.tree === undefined) {
         throw new Error("Tree is undefined");
      }
      while (this.tree?.count() <= this.treeSizeMinimum) {
         const first = cursor.growBranch(this.branchOptions);
         cursor.growBranch(this.branchOptions);
         cursor.growBranch(this.branchOptions);
         cursor.stepIn(first);
         cursor.growBranch(this.branchOptions);
         cursor.growBranch(this.branchOptions);
         cursor.growBranch(this.branchOptions);
         cursor.stepIn(1);
         cursor.growBranch(this.branchOptions);
         cursor.stepIn();
         cursor.growBranch(this.branchOptions);
         cursor.growBranch(this.branchOptions);
         cursor.growBranch(this.branchOptions);
         cursor.stepOut();
         cursor.stepOut();
         cursor.stepOut();
      }
   }
}
