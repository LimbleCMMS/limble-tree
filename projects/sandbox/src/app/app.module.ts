import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { LimbleTreeModule } from "@limble/limble-tree";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoremIpsumComponent } from "./lorem-ipsum/lorem-ipsum.component";
import { NodeComponent } from "./node/node.component";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
   declarations: [AppComponent, NodeComponent, LoremIpsumComponent],
   imports: [
      BrowserModule,
      AppRoutingModule,
      LimbleTreeModule,
      HttpClientModule
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule {}
