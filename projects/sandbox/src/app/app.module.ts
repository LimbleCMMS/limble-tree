import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { LimbleTreeModule } from "@limble/limble-tree";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NodeComponent } from "./node/node.component";

@NgModule({
   declarations: [AppComponent, NodeComponent],
   imports: [BrowserModule, AppRoutingModule, LimbleTreeModule],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule {}
