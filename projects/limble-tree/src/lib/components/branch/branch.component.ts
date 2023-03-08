import { CommonModule } from "@angular/common";
import {
   AfterViewInit,
   ApplicationRef,
   Component,
   ComponentRef,
   EventEmitter,
   Input,
   NgZone,
   OnDestroy,
   Output,
   QueryList,
   Type,
   ViewChild,
   ViewChildren,
   ViewContainerRef
} from "@angular/core";
import { map, merge } from "rxjs";
import { DropzoneComponent } from "../dropzone/dropzone.component";
import { HostComponent } from "../host-component.interface";
import { NodeComponent } from "../node-component.interface";
import { DragoverNoChangeDetectDirective } from "../../extras/drag-and-drop/dragover-no-change-detect";
import { assert } from "../../../shared/assert";

@Component({
   standalone: true,
   selector: "branch",
   templateUrl: "./branch.component.html",
   styleUrls: ["./branch.component.scss"],
   imports: [CommonModule, DropzoneComponent, DragoverNoChangeDetectDirective]
})
export class BranchComponent<T>
   implements NodeComponent, HostComponent<T>, AfterViewInit, OnDestroy
{
   @ViewChild("branchesContainer", { read: ViewContainerRef })
   branchesContainer: ViewContainerRef | undefined = undefined;
   @ViewChild("contentContainer", { read: ViewContainerRef })
   contentContainer: ViewContainerRef | undefined = undefined;
   @ViewChildren(DropzoneComponent) dropzones:
      | QueryList<DropzoneComponent>
      | undefined = undefined;

   @Input() contentToHost?: Type<T>;

   @Output() readonly contentCreated = new EventEmitter<T>();
   @Output() readonly showDropzones = new EventEmitter<"upper" | "lower">();
   @Output() readonly dropped = new EventEmitter<"inner" | "lateral">();

   public showInnerDropzone: boolean = false;
   public showLateralDropzone: boolean = false;

   private hostedContent?: ComponentRef<T>;

   public constructor(private readonly appRef: ApplicationRef) {}

   public ngAfterViewInit(): void {
      assert(this.contentContainer !== undefined);
      assert(this.contentToHost !== undefined);
      this.hostedContent = this.contentContainer.createComponent(
         this.contentToHost
      );
      this.contentCreated.emit(this.hostedContent.instance);
      assert(this.dropzones !== undefined);
      const inner = this.dropzones.get(0);
      const lateral = this.dropzones.get(1);
      assert(inner !== undefined && lateral !== undefined);
      merge(
         inner.dropped.pipe(map(() => "inner" as const)),
         lateral.dropped.pipe(map(() => "lateral" as const))
      ).subscribe(this.dropped);
      this.hostedContent.changeDetectorRef.detectChanges();
   }

   public getHostedContent(): ComponentRef<T> | undefined {
      return this.hostedContent;
   }

   public triggerChangeDetection(): void {
      if (!NgZone.isInAngularZone()) {
         this.appRef.tick();
      }
   }

   protected dragoverHandler(event: DragEvent): void {
      const elementHeight = (
         event.currentTarget as HTMLElement
      ).getBoundingClientRect().height;
      if (event.offsetY < elementHeight / 2) {
         this.showDropzones.emit("upper");
      } else {
         this.showDropzones.emit("lower");
      }
   }

   public ngOnDestroy(): void {
      //I'm not 100% sure why, but we have to remove any reference to the
      //componentRef otherwise Angular will never release it for garbage
      //collection.
      this.hostedContent = undefined;
   }
}
