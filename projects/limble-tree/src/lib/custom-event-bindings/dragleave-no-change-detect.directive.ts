import {
   Directive,
   ElementRef,
   EventEmitter,
   NgZone,
   OnDestroy,
   OnInit,
   Output
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";

@Directive({
   selector: "[dragleaveNoChangeDetect]"
})
export class DragleaveNoChangeDetectDirective implements OnInit, OnDestroy {
   @Output() readonly dragleaveNoChangeDetect: EventEmitter<DragEvent>;
   private eventSubscription: Subscription | undefined;

   constructor(
      private readonly ngZone: NgZone,
      private readonly el: ElementRef<Element>
   ) {
      this.dragleaveNoChangeDetect = new EventEmitter<DragEvent>();
   }

   ngOnInit() {
      this.ngZone.runOutsideAngular(() => {
         this.eventSubscription = fromEvent<DragEvent>(
            this.el.nativeElement,
            "dragleave"
         ).subscribe(($event) => {
            this.dragleaveNoChangeDetect.emit($event);
         });
      });
   }

   ngOnDestroy() {
      if (this.eventSubscription !== undefined) {
         this.eventSubscription.unsubscribe();
      }
   }
}
