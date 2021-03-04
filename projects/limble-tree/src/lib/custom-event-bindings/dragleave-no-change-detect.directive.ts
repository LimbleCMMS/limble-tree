import {
   Directive,
   ElementRef,
   EventEmitter,
   Input,
   NgZone,
   OnDestroy,
   OnInit,
   Output
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { throttleTime } from "rxjs/operators";

@Directive({
   selector: "[dragleaveNoChangeDetect]"
})
export class DragleaveNoChangeDetectDirective implements OnInit, OnDestroy {
   @Input() dragleaveEventThrottle: number;
   @Output() readonly dragleaveNoChangeDetect: EventEmitter<DragEvent>;
   private eventSubscription: Subscription | undefined;

   constructor(
      private readonly ngZone: NgZone,
      private readonly el: ElementRef<Element>
   ) {
      this.dragleaveNoChangeDetect = new EventEmitter<DragEvent>();
      this.dragleaveEventThrottle = 0;
   }

   ngOnInit() {
      this.ngZone.runOutsideAngular(() => {
         this.eventSubscription = fromEvent<DragEvent>(
            this.el.nativeElement,
            "dragleave"
         )
            .pipe(throttleTime(this.dragleaveEventThrottle))
            .subscribe(($event) => {
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
