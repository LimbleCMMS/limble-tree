import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {
   LimbleTreeModule,
   TreeCollapseModule,
   TreeDragAndDropModule
} from "@limble/limble-tree";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoremIpsumComponent } from "./lorem-ipsum/lorem-ipsum.component";
import { ContentProjectorComponent } from "./content-projector/content-projector.component";
import { TextRendererComponent } from "./text-renderer/text-renderer.component";
import { BoxComponent } from "./box/box.component";
import { CollapsibleComponent } from "./collapsible/collapsible.component";
import { DraggableComponent } from "./draggable/draggable.component";

@NgModule({
   declarations: [
      AppComponent,
      ContentProjectorComponent,
      LoremIpsumComponent,
      TextRendererComponent,
      BoxComponent,
      CollapsibleComponent,
      DraggableComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      LimbleTreeModule,
      TreeCollapseModule,
      TreeDragAndDropModule
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule {}
