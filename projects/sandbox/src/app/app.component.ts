import { CommonModule } from "@angular/common";
import {
   AfterViewInit,
   Component,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import {
   LimbleTreeModule,
   TreeDragAndDropService,
   TreeRoot,
   TreeService
} from "@limble/limble-tree";
import { EMPTY, map, Observable, scan } from "rxjs";
import { CollapsibleComponent } from "./collapsible/collapsible.component";
import { DraggableComponent } from "./draggable/draggable.component";
import { LoremIpsumComponent } from "./lorem-ipsum/lorem-ipsum.component";
import { TextRendererComponent } from "./text-renderer/text-renderer.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
   standalone: true,
   selector: "app-root",
   templateUrl: "./app.component.html",
   styleUrls: ["./app.component.scss"],
   imports: [
      CommonModule,
      LimbleTreeModule,
      MatToolbarModule,
      MatIconModule,
      MatButtonModule
   ]
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

   public constructor(
      private readonly treeService: TreeService,
      private readonly dragAndDrop: TreeDragAndDropService
   ) {}

   public resetTrees = (): void => {
      this.root?.destroy();
      this.root2?.destroy();
      this.events$ = EMPTY;
      this.events2$ = EMPTY;
      const [root, root2] = this.buildTrees();
      this.root = root;
      this.root2 = root2;
   };

   public ngAfterViewInit(): void {
      this.resetTrees();
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
      branch2
         .grow(LoremIpsumComponent)
         .grow(DraggableComponent)
         .grow(DraggableComponent)
         .grow(DraggableComponent)
         .grow(DraggableComponent)
         .grow(DraggableComponent);
      branch3.grow(DraggableComponent);
      branch1b.grow(LoremIpsumComponent);
      const branch1b1 = branch1b.grow(CollapsibleComponent, {
         defaultCollapsed: true
      });
      branch1b1.grow(LoremIpsumComponent);
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
         scan(
            (acc, curr) => {
               acc.push(curr);
               return acc;
            },
            [] as Array<{ type: string }>
         )
      );
      this.events2$ = root2.events().pipe(
         map((event) => {
            return { type: event.constructor.name };
         }),
         scan(
            (acc, curr) => {
               acc.push(curr);
               return acc;
            },
            [] as Array<{ type: string }>
         )
      );
      return [root, root2];
   }
}
