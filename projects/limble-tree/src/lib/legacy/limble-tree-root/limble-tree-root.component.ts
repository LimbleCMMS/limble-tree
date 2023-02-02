import {
   AfterViewInit,
   Component,
   EventEmitter,
   Input,
   OnChanges,
   OnDestroy,
   Output,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { LegacyTree } from "../legacy-tree";
import { TreeError } from "../../errors";
import { LimbleTreeData } from "../legacy-tree-data.interface";
import { LimbleTreeOptions } from "../legacy-tree-options.interface";
import { TreeRoot } from "../../core";
import { filter, Subscription } from "rxjs";
import { DragEndEvent } from "../../events";

/** @deprecated */
@Component({
   selector: "limble-tree-root",
   templateUrl: "./limble-tree-root.component.html",
   standalone: true
})
export class LimbleTreeRootComponent
   implements AfterViewInit, OnChanges, OnDestroy
{
   @Input() data?: LimbleTreeData;
   @Input() options?: LimbleTreeOptions;
   @Input() itemsPerPage?: number;
   @Input() page?: number;

   @ViewChild("host", { read: ViewContainerRef }) host?: ViewContainerRef;

   @Output() readonly treeChange = new EventEmitter<void>();
   @Output() readonly treeDrop = new EventEmitter<DragEndEvent<any>>();

   private dropSubscription?: Subscription;
   private readonly legacyTree: LegacyTree;
   private root?: TreeRoot<any>;

   public constructor() {
      this.legacyTree = new LegacyTree();
   }

   public ngAfterViewInit(): void {
      this.update();
   }

   public ngOnChanges(): void {
      if (this.host !== undefined && this.data !== undefined) {
         this.update();
      }
   }

   public ngOnDestroy(): void {
      this.dropSubscription?.unsubscribe();
   }

   public update(): void {
      if (this.data === undefined) {
         throw new TreeError(
            "LimbleTreeRootComponent's `data` input is required"
         );
      }
      if (this.host === undefined) {
         throw new TreeError(
            "LimbleTreeRootComponent's `host` property is not defined"
         );
      }
      this.root = this.legacyTree.createTreeFromLegacyArray(
         this.host,
         this.data,
         this.options
      );
      this.treeChange.emit();
      this.dropSubscription?.unsubscribe();
      this.dropSubscription = this.root
         .events()
         .pipe(
            filter(
               (event): event is DragEndEvent<any> =>
                  event instanceof DragEndEvent
            )
         )
         .subscribe(this.treeDrop);
   }
}
