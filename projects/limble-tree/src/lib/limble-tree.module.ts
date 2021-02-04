import { NgModule } from "@angular/core";
import { ComponentCreatorService } from "./singletons/component-creator.service";
import { DropZoneComponent } from "./drop-zone/drop-zone.component";
import { LimbleTreeBranchComponent } from "./limble-tree-branch/limble-tree-branch.component";
import { CommonModule } from "@angular/common";
import { LimbleTreeNodeComponent } from "./limble-tree-node/limble-tree-node.component";
import { DragStateService } from "./singletons/drag-state.service";
import { LimbleTreeRootComponent } from "./limble-tree-root/limble-tree-root.component";
import { LimbleTreePlaceholderComponent } from './limble-tree-placeholder/limble-tree-placeholder.component';

@NgModule({
   declarations: [
      LimbleTreeBranchComponent,
      DropZoneComponent,
      LimbleTreeNodeComponent,
      LimbleTreeRootComponent,
      LimbleTreePlaceholderComponent
   ],
   imports: [CommonModule],
   exports: [LimbleTreeRootComponent],
   providers: [ComponentCreatorService, DragStateService]
})
export class LimbleTreeModule {}
