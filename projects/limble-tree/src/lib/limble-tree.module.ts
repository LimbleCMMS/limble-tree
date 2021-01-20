import { NgModule } from "@angular/core";
import { DropZoneComponent } from "./drop-zone/drop-zone.component";
import { LimbleTreeComponent } from "./limble-tree.component";

@NgModule({
   declarations: [LimbleTreeComponent, DropZoneComponent],
   imports: [],
   exports: [LimbleTreeComponent]
})
export class LimbleTreeModule {}
