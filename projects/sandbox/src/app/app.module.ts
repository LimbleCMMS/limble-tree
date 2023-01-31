import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { LimbleTreeModule } from "@limble/limble-tree";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoremIpsumComponent } from "./lorem-ipsum/lorem-ipsum.component";
import { ContentProjectorComponent } from "./content-projector/content-projector.component";
import { TextRendererComponent } from "./text-renderer/text-renderer.component";
import { BoxComponent } from "./box/box.component";

@NgModule({
   declarations: [
      AppComponent,
      ContentProjectorComponent,
      LoremIpsumComponent,
      TextRendererComponent,
      BoxComponent
   ],
   imports: [BrowserModule, AppRoutingModule, LimbleTreeModule],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule {}
