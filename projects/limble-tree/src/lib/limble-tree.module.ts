import { NgModule } from "@angular/core";
import { ComponentCreatorService } from "./singletons/component-creator.service";
import { DropZoneComponent } from "./drop-zone/drop-zone.component";
import { LimbleTreeBranchComponent } from "./limble-tree-branch/limble-tree-branch.component";
import { CommonModule } from "@angular/common";
import { LimbleTreeNodeComponent } from "./limble-tree-node/limble-tree-node.component";
import { DragStateService } from "./singletons/drag-state.service";
import { LimbleTreeRootComponent } from "./limble-tree-root/limble-tree-root.component";
import { LimbleTreePlaceholderComponent } from "./limble-tree-placeholder/limble-tree-placeholder.component";
import { GlobalEventsService } from "./singletons/global-events.service";
import { DragoverNoChangeDetectDirective } from "./custom-event-bindings/dragover-no-change-detect.directive";
import { DragleaveNoChangeDetectDirective } from "./custom-event-bindings/dragleave-no-change-detect.directive";

@NgModule({
   declarations: [
      LimbleTreeBranchComponent,
      DropZoneComponent,
      LimbleTreeNodeComponent,
      LimbleTreeRootComponent,
      LimbleTreePlaceholderComponent,
      DragoverNoChangeDetectDirective,
      DragleaveNoChangeDetectDirective
   ],
   imports: [CommonModule],
   exports: [LimbleTreeRootComponent],
   providers: [ComponentCreatorService, DragStateService, GlobalEventsService]
})
export class LimbleTreeModule {}
