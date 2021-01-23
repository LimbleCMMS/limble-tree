import { NgModule } from "@angular/core";
import { ComponentCreatorService } from "./singletons/component-creator.service";
import { DropZoneComponent } from "./drop-zone/drop-zone.component";
import { LimbleTreeComponent } from "./limble-tree.component";
import { LimbleTreeService } from "./singletons/limble-tree.service";
import { CommonModule } from "@angular/common";
import { LimbleTreeNodeComponent } from "./limble-tree-node/limble-tree-node.component";
import { TempService } from "./singletons/temp.service";
import { DropZoneService } from "./singletons/drop-zone.service";
import { TreeRendererService } from "./singletons/tree-renderer.service";

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
      DropZoneService,
      TreeRendererService
   ]
})
export class LimbleTreeModule {}
