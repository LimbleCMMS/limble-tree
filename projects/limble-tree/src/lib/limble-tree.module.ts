import { NgModule } from "@angular/core";
import { ComponentCreatorService } from "./componentCreator.service";
import { DropZoneComponent } from "./drop-zone/drop-zone.component";
import { LimbleTreeComponent } from "./limble-tree.component";
import { LimbleTreeService } from "./limble-tree.service";
import { CommonModule } from "@angular/common";
import { LimbleTreeNodeComponent } from "./limble-tree-node/limble-tree-node.component";
import { TempService } from "./temp.service";
import { DropZoneService } from "./drop-zone/drop-zone.service";

@NgModule({
   declarations: [
      LimbleTreeComponent,
      DropZoneComponent,
      LimbleTreeNodeComponent
   ],
   imports: [CommonModule],
   exports: [LimbleTreeComponent],
   providers: [
      ComponentCreatorService,
      LimbleTreeService,
      TempService,
      DropZoneService
   ]
})
export class LimbleTreeModule {}
