import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { LimbleTreeModule } from "@limble/limble-tree";
import { TreeItemComponent } from "./tree-item/tree-item.component";
import { TreeItemAltComponent } from "./tree-item-alt/tree-item-alt.component";

@NgModule({
   declarations: [AppComponent, TreeItemComponent, TreeItemAltComponent],
   imports: [BrowserModule, LimbleTreeModule],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule {}
