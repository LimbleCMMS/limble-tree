import {
   AfterViewInit,
   Component,
   ComponentRef,
   Input,
   Type,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
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

   private hostedContent?: ComponentRef<T>;

   public ngAfterViewInit(): void {
      if (this.contentContainer === undefined) {
         throw new Error("Cannot get contentContainer");
      }
      if (this.contentToHost === undefined) {
         throw new Error("'content' is a required input");
      }
      this.hostedContent = this.contentContainer.createComponent(
         this.contentToHost
      );
   }

   public getHostedContent(): ComponentRef<T> | undefined {
      return this.hostedContent;
   }
}
