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
import { assert } from "../../../shared/assert";

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
   @Input() options?: LimbleTreeOptions | undefined;
   @Input() itemsPerPage: number = Infinity;
   @Input() page: number = 1;

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
      this.root?.destroy();
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
      this.root?.destroy();
      this.dropSubscription?.unsubscribe();
      const dataSlice = this.paginatedData();
      this.root = this.legacyTree.createTreeFromLegacyArray(
         this.host,
         dataSlice,
         this.options
      );
      this.treeChange.emit();
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

   private paginatedData(): LimbleTreeData {
      assert(this.data !== undefined);
      if (this.options?.listMode !== true) {
         return this.data;
      }
      return this.data.slice(
         this.page * this.itemsPerPage,
         (this.page + 1) * this.itemsPerPage
      );
   }
}
