import { NgModule } from "@angular/core";
import { TreeCollapseService } from "./collapse.service";

/** A module containing the entities which provide collapse functionality */
@NgModule({
   providers: [TreeCollapseService]
})
export class TreeCollapseModule {}
