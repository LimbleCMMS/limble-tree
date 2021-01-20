import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   ContentChild,
   Input,
   TemplateRef,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { NodeInserterService } from "./nodeInserter.service";
import { LimbleTreeData } from "./limble-tree.service";

@Component({
   selector: "limble-tree",
   templateUrl: "./limble-tree.component.html",
   styles: ["./limble-tree.component.scss"]
})
export class LimbleTreeComponent implements AfterViewInit {
   @Input() treeData: LimbleTreeData | undefined;

   @ContentChild("limbleTreeNodeTemplate", { read: TemplateRef })
   nodeTemplate: TemplateRef<unknown> | undefined;

   @ViewChild("host", { read: ViewContainerRef }) host:
      | ViewContainerRef
      | undefined;

   constructor(
      private readonly componentCreatorService: NodeInserterService,
      private readonly changeDetectorRef: ChangeDetectorRef
   ) {}

   ngAfterViewInit() {
      if (this.host === undefined) {
         throw new Error(
            "Failed to render limble tree. Failure occurred at root."
         );
      }
      if (this.treeData === undefined) {
         throw new Error(`limbleTree requires a data object`);
      }
      if (this.nodeTemplate === undefined) {
         throw new Error(
            `limbleTree requires a template reference called #limbleTreeNodeTemplate`
         );
      }
      for (const item of this.treeData.nodes) {
         this.componentCreatorService.appendNode(
            this.host,
            item,
            this.nodeTemplate
         );
      }
      this.changeDetectorRef.detectChanges();
   }
}
