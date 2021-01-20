import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   Input,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { ComponentCreatorService } from "../componentCreator.service";
import { ComponentObj, LimbleTreeNode } from "../limble-tree.service";

@Component({
   selector: "limble-tree-node",
   templateUrl: "./limble-tree-node.component.html",
   styleUrls: ["./limble-tree-node.component.scss"]
})
export class LimbleTreeNodeComponent implements AfterViewInit {
   @Input() component: ComponentObj | undefined;
   @Input() nodeData: LimbleTreeNode["data"];
   @ViewChild("nodeHost", { read: ViewContainerRef }) private nodeHost:
      | ViewContainerRef
      | undefined;

   constructor(
      private readonly componentCreatorService: ComponentCreatorService,
      private readonly changeDetectorRef: ChangeDetectorRef
   ) {}

   ngAfterViewInit() {
      if (this.nodeHost === undefined || this.component === undefined) {
         throw new Error("Failed to render tree node");
      }
      const componentRef = this.componentCreatorService.appendComponent<any>(
         this.component.class,
         this.nodeHost
      );
      componentRef.instance.nodeData = this.nodeData;
      for (const binding in this.component.bindings) {
         componentRef.instance[binding] = this.component.bindings[binding];
      }
      this.changeDetectorRef.detectChanges();
   }

   public dragstartHandler(event: DragEvent): void {
      event.stopPropagation();
      console.log("drag started", event);
      // this.enableDropZones = false;
      // if (event.dataTransfer === null) {
      //    return;
      // }
      // event.dataTransfer.dropEffect = "move";
      // const draggedElement = event.target as HTMLElement;
      // draggedElement.classList.add("dragging");
      // this.tempService.set(draggedElement);
   }

   public dragendHandler(event: DragEvent): void {
      event.stopPropagation();
      console.log("drag ended", event);
      // const draggedElement = event.target as HTMLElement;
      // draggedElement.classList.remove("dragging");
      // this.enableDropZones = true;
   }
}
