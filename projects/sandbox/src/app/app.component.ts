import {
   AfterViewInit,
   Component,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import {
   TreeDragAndDropService,
   TreeRoot,
   TreeService
} from "@limble/limble-tree";
import { EMPTY, map, Observable, scan } from "rxjs";
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

   protected events$?: Observable<Array<{ type: string }>>;
   protected events2$?: Observable<Array<{ type: string }>>;

   private root?: TreeRoot<
      | LoremIpsumComponent
      | TextRendererComponent
      | CollapsibleComponent
      | DraggableComponent
   >;
   private root2?: TreeRoot<
      | LoremIpsumComponent
      | TextRendererComponent
      | CollapsibleComponent
      | DraggableComponent
   >;
   private toggle = 1;

   public constructor(
      private readonly treeService: TreeService,
      private readonly dragAndDrop: TreeDragAndDropService
   ) {}

   public toggleTrees = (): void => {
      if (this.toggle === 0) {
         this.root?.destroy();
         this.root2?.destroy();
         this.events$ = EMPTY;
         this.events2$ = EMPTY;
         this.toggle = 1;
      } else {
         const [root, root2] = this.buildTrees();
         this.root = root;
         this.root2 = root2;
         this.toggle = 0;
      }
   };

   public ngAfterViewInit(): void {
      this.toggleTrees();
   }

   public showRootDropzone(): void {
      if (!this.root2) return;
      if (this.root2.branches().length > 0) return;
      this.dragAndDrop.showRootDropzone(this.root2);
   }

   private buildTrees(): [
      TreeRoot<
         | LoremIpsumComponent
         | TextRendererComponent
         | CollapsibleComponent
         | DraggableComponent
      >,
      TreeRoot<
         | LoremIpsumComponent
         | TextRendererComponent
         | CollapsibleComponent
         | DraggableComponent
      >
   ] {
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
      branch1.grow(TextRendererComponent, {
         inputBindings: {
            text1: "This is the first test string",
            text2: "This is the second test string"
         }
      });
      const branch1b = branch1.grow(CollapsibleComponent, {
         defaultCollapsed: true
      });
      branch1.grow(DraggableComponent);
      branch2.grow(LoremIpsumComponent);
      branch3.grow(DraggableComponent);
      branch1b.grow(LoremIpsumComponent);
      const root2 = this.treeService.createEmptyTree<
         | LoremIpsumComponent
         | TextRendererComponent
         | CollapsibleComponent
         | DraggableComponent
      >(this.treeContainer2);
      root2.grow(LoremIpsumComponent);
      root2.grow(DraggableComponent);
      this.events$ = root.events().pipe(
         map((event) => {
            return { type: event.constructor.name };
         }),
         scan((acc, curr) => {
            acc.push(curr);
            return acc;
         }, [] as Array<{ type: string }>)
      );
      this.events2$ = root2.events().pipe(
         map((event) => {
            return { type: event.constructor.name };
         }),
         scan((acc, curr) => {
            acc.push(curr);
            return acc;
         }, [] as Array<{ type: string }>)
      );
      return [root, root2];
   }
}
