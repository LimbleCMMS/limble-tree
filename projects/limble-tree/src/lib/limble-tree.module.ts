import { NgModule } from "@angular/core";
import { ComponentsModule } from "./components/components.module";
import { TreeService } from "./core/tree-service/tree.service";

@NgModule({
   declarations: [],
   imports: [ComponentsModule],
   providers: [TreeService],
   exports: []
})
export class LimbleTreeModule {}
