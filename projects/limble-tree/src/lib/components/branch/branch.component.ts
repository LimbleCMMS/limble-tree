import { CommonModule } from "@angular/common";
import {
   AfterViewInit,
   Component,
   ComponentRef,
   EventEmitter,
   Input,
   OnDestroy,
   Output,
   QueryList,
   Type,
   ViewChild,
   ViewChildren,
   ViewContainerRef
} from "@angular/core";
import { map, merge } from "rxjs";
import { TreeError } from "../../errors";
import { DropzoneComponent } from "../dropzone/dropzone.component";
import { HostComponent } from "../host-component.interface";
import { NodeComponent } from "../node-component.interface";

@Component({
   standalone: true,
   selector: "branch",
   templateUrl: "./branch.component.html",
   styleUrls: ["./branch.component.scss"],
   imports: [CommonModule, DropzoneComponent]
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

   public ngAfterViewInit(): void {
      if (this.contentContainer === undefined) {
         throw new TreeError("Cannot get contentContainer");
      }
      if (this.contentToHost === undefined) {
         throw new TreeError("'content' is a required input");
      }
      this.hostedContent = this.contentContainer.createComponent(
         this.contentToHost
      );
      this.contentCreated.emit(this.hostedContent.instance);
      if (this.dropzones === undefined) {
         throw new Error("querylist not defined");
      }
      const inner = this.dropzones.get(0);
      const lateral = this.dropzones.get(1);
      if (inner === undefined || lateral == undefined) {
         throw new Error("dropzones not defined");
      }
      merge(
         inner.dropped.pipe(map(() => "inner" as const)),
         lateral.dropped.pipe(map(() => "lateral" as const))
      ).subscribe(this.dropped);
      this.hostedContent.changeDetectorRef.detectChanges();
   }

   public getHostedContent(): ComponentRef<T> | undefined {
      return this.hostedContent;
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
