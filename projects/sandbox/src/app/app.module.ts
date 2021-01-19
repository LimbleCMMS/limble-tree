import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { LimbleTreeModule } from "limble-tree";

@NgModule({
   declarations: [AppComponent],
   imports: [BrowserModule, LimbleTreeModule],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule {}
