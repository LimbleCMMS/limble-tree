import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { TreeService } from "@limble/limble-tree";
import { ContentProjectorComponent } from "./content-projector/content-projector.component";
import { LoremIpsumComponent } from "./lorem-ipsum/lorem-ipsum.component";
import { TextRendererComponent } from "./text-renderer/text-renderer.component";

@Component({
   selector: "app-root",
   templateUrl: "./app.component.html",
   styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit {
   @ViewChild("treeContainer", { read: ViewContainerRef })
   treeContainer?: ViewContainerRef;

   protected events: Array<{ type: string }>;

   public constructor(
      private readonly treeService: TreeService,
      private readonly changeDetectorRef: ChangeDetectorRef
   ) {
      this.events = [];
   }

   public ngAfterViewInit(): void {
      if (this.treeContainer === undefined) {
         throw new Error("cannot get tree container");
      }
      const root = this.treeService.createEmptyTree(this.treeContainer);
      const branch1 = root.grow(LoremIpsumComponent);
      const branch2 = root.grow(LoremIpsumComponent);
      const branch3 = root.grow(LoremIpsumComponent);
      //FIXME
      const branch1a = branch1.grow(TextRendererComponent);
      //FIXME
      const branch1b = branch1.grow(ContentProjectorComponent);
      const branch1c = branch1.grow(LoremIpsumComponent);
      const branch2a = branch2.grow(LoremIpsumComponent);
      const branch3a = branch3.grow(LoremIpsumComponent);
      const branch1b1 = branch1b.grow(LoremIpsumComponent);
      setTimeout(() => {
         branch1a.prune();
         branch1b.prune();
      }, 2500);
      setTimeout(() => {
         branch1a.graftTo(branch3);
         branch1b.graftTo(branch3);
      }, 5000);
      this.changeDetectorRef.detectChanges();
      root.events().subscribe((event) => {
         this.events.push({ type: event.type() });
      });
   }
}
