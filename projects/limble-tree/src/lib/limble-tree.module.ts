import { NgModule } from "@angular/core";
import { ComponentCreatorService } from "./singletons/component-creator.service";
import { DropZoneComponent } from "./drop-zone/drop-zone.component";
import { LimbleTreeBranchComponent } from "./limble-tree-branch/limble-tree-branch.component";
import { LimbleTreeService } from "./singletons/limble-tree.service";
import { CommonModule } from "@angular/common";
import { LimbleTreeNodeComponent } from "./limble-tree-node/limble-tree-node.component";
import { TempService } from "./singletons/temp.service";
import { DropZoneService } from "./singletons/drop-zone.service";
import { TreeRendererService } from "./singletons/tree-renderer.service";
import { LimbleTreeRootComponent } from "./limble-tree-root/limble-tree-root.component";

@NgModule({
   declarations: [
      LimbleTreeBranchComponent,
      DropZoneComponent,
      LimbleTreeNodeComponent,
      LimbleTreeRootComponent
   ],
   imports: [CommonModule],
   exports: [LimbleTreeRootComponent],
   providers: [
      ComponentCreatorService,
      LimbleTreeService,
      TempService,
      DropZoneService,
      TreeRendererService
   ]
})
export class LimbleTreeModule {}
