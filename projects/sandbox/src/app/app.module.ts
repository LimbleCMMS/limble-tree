import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { LimbleTreeModule, TreeCollapseModule } from "@limble/limble-tree";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoremIpsumComponent } from "./lorem-ipsum/lorem-ipsum.component";
import { ContentProjectorComponent } from "./content-projector/content-projector.component";
import { TextRendererComponent } from "./text-renderer/text-renderer.component";
import { BoxComponent } from "./box/box.component";
import { CollapsibleComponent } from "./collapsible/collapsible.component";

@NgModule({
   declarations: [
      AppComponent,
      ContentProjectorComponent,
      LoremIpsumComponent,
      TextRendererComponent,
      BoxComponent,
      CollapsibleComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      LimbleTreeModule,
      TreeCollapseModule
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule {}
