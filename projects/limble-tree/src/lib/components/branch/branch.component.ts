import {
   AfterViewInit,
   Component,
   ComponentRef,
   Input,
   Type,
   ViewChild,
   ViewContainerRef
} from "@angular/core";
import { NodeComponent } from "../node-component";

@Component({
   selector: "branch",
   templateUrl: "./branch.component.html",
   styleUrls: ["./branch.component.scss"]
})
export class BranchComponent<T> implements NodeComponent, AfterViewInit {
   @ViewChild("branchesContainer", { read: ViewContainerRef })
   branchesContainer: ViewContainerRef | undefined = undefined;
   @ViewChild("contentContainer", { read: ViewContainerRef })
   contentContainer: ViewContainerRef | undefined = undefined;

   @Input() content?: Type<T>;

   private contentRef?: ComponentRef<T>;

   public ngAfterViewInit(): void {
      if (this.contentContainer === undefined) {
         throw new Error("Cannot get contentContainer");
      }
      if (this.content === undefined) {
         throw new Error("'content' is a required input");
      }
      this.contentRef = this.contentContainer.createComponent(this.content);
   }

   public getContentRef(): ComponentRef<T> | undefined {
      return this.contentRef;
   }
}
