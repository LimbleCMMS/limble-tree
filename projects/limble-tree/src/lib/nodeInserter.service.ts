import {
   ComponentFactoryResolver,
   Injectable,
   ViewContainerRef
} from "@angular/core";
import { LimbleTreeNodeComponent } from "./limble-tree-node/limble-tree-node.component";
import { LimbleTreeNode } from "./limble-tree.service";

@Injectable()
export class NodeInserterService {
   constructor(private readonly factoryResolver: ComponentFactoryResolver) {
      this.factoryResolver = factoryResolver;
   }

   appendNode(viewContainerRef: ViewContainerRef, node: LimbleTreeNode) {
      console.log(viewContainerRef);
      const componentFactory = this.factoryResolver.resolveComponentFactory(
         LimbleTreeNodeComponent
      );
      const componentRef = viewContainerRef.createComponent<LimbleTreeNodeComponent>(
         componentFactory
      );
      componentRef.instance.node = node;
   }
}
