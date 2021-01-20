import { NgModule } from "@angular/core";
import { NodeInserterService } from "./nodeInserter.service";
import { DropZoneComponent } from "./drop-zone/drop-zone.component";
import { LimbleTreeComponent } from "./limble-tree.component";
import { LimbleTreeNodeComponent } from "./limble-tree-node/limble-tree-node.component";

@NgModule({
   declarations: [
      LimbleTreeComponent,
      DropZoneComponent,
      LimbleTreeNodeComponent
   ],
   imports: [],
   exports: [LimbleTreeComponent],
   providers: [NodeInserterService]
})
export class LimbleTreeModule {}
