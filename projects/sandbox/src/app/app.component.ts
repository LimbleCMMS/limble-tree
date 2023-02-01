import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { TreeService } from "@limble/limble-tree";
import { CollapsibleComponent } from "./collapsible/collapsible.component";
import { DraggableComponent } from "./draggable/draggable.component";
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
   @ViewChild("treeContainer2", { read: ViewContainerRef })
   treeContainer2?: ViewContainerRef;

   protected events: Array<{ type: string }>;
   protected events2: Array<{ type: string }>;

   public constructor(
      private readonly treeService: TreeService,
      private readonly changeDetectorRef: ChangeDetectorRef
   ) {
      this.events = [];
      this.events2 = [];
   }

   public ngAfterViewInit(): void {
      if (
         this.treeContainer === undefined ||
         this.treeContainer2 === undefined
      ) {
         throw new Error("cannot get tree containers");
      }
      const root = this.treeService.createEmptyTree<
         | LoremIpsumComponent
         | TextRendererComponent
         | CollapsibleComponent
         | DraggableComponent
      >(this.treeContainer);
      const branch1 = root.grow(LoremIpsumComponent);
      const branch2 = root.grow(LoremIpsumComponent);
      const branch3 = root.grow(LoremIpsumComponent);
      const branch1a = branch1.grow(TextRendererComponent, {
         inputBindings: {
            text1: "This is the first test string",
            text2: "This is the second test string"
         }
      });
      const branch1b = branch1.grow(CollapsibleComponent);
      const branch1c = branch1.grow(DraggableComponent);
      const branch2a = branch2.grow(LoremIpsumComponent);
      const branch3a = branch3.grow(DraggableComponent);
      const branch1b1 = branch1b.grow(LoremIpsumComponent);
      // setTimeout(() => {
      //    branch1a.prune();
      //    branch1b.prune();
      // }, 2000);
      // setTimeout(() => {
      //    branch1a.graftTo(branch3);
      //    branch1b.graftTo(branch3);
      // }, 3000);
      this.changeDetectorRef.detectChanges();
      root.events().subscribe((event) => {
         this.events.push({ type: event.type() });
      });

      const root2 = this.treeService.createEmptyTree<
         | LoremIpsumComponent
         | TextRendererComponent
         | CollapsibleComponent
         | DraggableComponent
      >(this.treeContainer2);
      root2.grow(LoremIpsumComponent);
      root2.grow(DraggableComponent);
      root2.events().subscribe((event) => {
         this.events2.push({ type: event.type() });
      });
   }
}
