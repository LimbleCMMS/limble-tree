import {
   AfterViewInit,
   Component,
   ComponentRef,
   EventEmitter,
   Input,
   Output,
   Type,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { TreeError } from "../../errors";
import { HostComponent } from "../host-component.interface";
import { NodeComponent } from "../node-component.interface";

@Component({
   selector: "branch",
   templateUrl: "./branch.component.html",
   styleUrls: ["./branch.component.scss"]
})
export class BranchComponent<T>
   implements NodeComponent, HostComponent<T>, AfterViewInit
{
   @ViewChild("branchesContainer", { read: ViewContainerRef })
   branchesContainer: ViewContainerRef | undefined = undefined;
   @ViewChild("contentContainer", { read: ViewContainerRef })
   contentContainer: ViewContainerRef | undefined = undefined;

   @Input() contentToHost?: Type<T>;

   @Output() readonly contentCreated = new EventEmitter<T>();

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
   }

   public getHostedContent(): ComponentRef<T> | undefined {
      return this.hostedContent;
   }
}
