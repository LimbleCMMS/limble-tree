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
   standalone: true,
   selector: "[dragoverNoChangeDetect]"
})
export class DragoverNoChangeDetectDirective implements OnInit, OnDestroy {
   @Input() dragoverEventThrottle: number;
   @Output() readonly dragoverNoChangeDetect: EventEmitter<DragEvent>;
   private eventSubscription: Subscription | undefined;

   public constructor(
      private readonly ngZone: NgZone,
      private readonly el: ElementRef<Element>
   ) {
      this.dragoverNoChangeDetect = new EventEmitter<DragEvent>();
      this.dragoverEventThrottle = 25;
   }

   public ngOnInit(): void {
      this.ngZone.runOutsideAngular(() => {
         this.eventSubscription = fromEvent<DragEvent>(
            this.el.nativeElement,
            "dragover"
         )
            .pipe(throttleTime(this.dragoverEventThrottle))
            .subscribe(($event) => {
               this.dragoverNoChangeDetect.emit($event);
            });
      });
   }

   public ngOnDestroy(): void {
      if (this.eventSubscription !== undefined) {
         this.eventSubscription.unsubscribe();
      }
   }
}
