import { Component, Input } from "@angular/core";
import { TreeBranch, TreeCollapseService } from "@limble/limble-tree";

@Component({
   selector: "collapsible",
   templateUrl: "./collapsible.component.html",
   styleUrls: ["./collapsible.component.scss"]
})
export class CollapsibleComponent {
   @Input() treeBranch?: TreeBranch<CollapsibleComponent>;
   protected collapsed: boolean;

   public constructor(private readonly collapseService: TreeCollapseService) {
      this.collapsed = false;
   }

   protected toggle(): void {
      if (this.treeBranch === undefined) return;
      this.collapsed = !this.collapsed;
      if (this.collapsed) {
         this.collapseService.collapse(this.treeBranch);
      }
      if (!this.collapsed) {
         this.collapseService.expand(this.treeBranch);
      }
   }
}
