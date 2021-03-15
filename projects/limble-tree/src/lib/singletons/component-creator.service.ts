import {
   ComponentFactoryResolver,
   Injectable,
   Type,
   ViewContainerRef
} from "@angular/core";

@Injectable()
export class ComponentCreatorService {
   constructor(private readonly factoryResolver: ComponentFactoryResolver) {
      this.factoryResolver = factoryResolver;
   }

   appendComponent<T = unknown>(
      component: Type<T>,
      viewContainerRef: ViewContainerRef,
      index: number | undefined = undefined
   ) {
      const componentFactory = this.factoryResolver.resolveComponentFactory(
         component
      );
      const componentRef = viewContainerRef.createComponent<T>(
         componentFactory,
         index
      );
      return componentRef;
   }
}
