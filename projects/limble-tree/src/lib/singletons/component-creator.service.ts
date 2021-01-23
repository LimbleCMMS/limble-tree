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
      index: number | null = null
   ) {
      const componentFactory = this.factoryResolver.resolveComponentFactory(
         component
      );
      const componentRef = viewContainerRef.createComponent<T>(
         componentFactory
      );
      if (index !== null) {
         const currentIndex = viewContainerRef.indexOf(componentRef.hostView);
         viewContainerRef.detach(currentIndex);
         viewContainerRef.insert(componentRef.hostView, index);
      }
      return componentRef;
   }
}
