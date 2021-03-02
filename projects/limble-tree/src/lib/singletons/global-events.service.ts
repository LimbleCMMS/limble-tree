import { Injectable } from "@angular/core";
import { fromEvent, Observable, Subscription } from "rxjs";
import { filter, throttleTime } from "rxjs/operators";

@Injectable()
export class GlobalEventsService {
   private globalDrag$: Observable<DragEvent>;
   private globalDragSubscription: Subscription | undefined;
   public scrolling: boolean;

   constructor() {
      this.globalDrag$ = fromEvent<DragEvent>(document, "drag");
      this.scrolling = false;
   }

   public addScrolling() {
      if (this.globalDragSubscription !== undefined) {
         return;
      }
      let viewPortHeight: number;
      let scrollAreaSize: number;
      let edgeTop: number;
      let edgeBottom: number;
      let isInTopScrollArea: boolean;
      let isInBottomScrollArea: boolean;
      let timer: ReturnType<typeof setTimeout>;
      this.globalDragSubscription = this.globalDrag$
         .pipe(
            filter((event) => {
               viewPortHeight = document.documentElement.clientHeight;
               scrollAreaSize = Math.min(viewPortHeight * 0.08, 150);
               edgeTop = scrollAreaSize;
               edgeBottom = viewPortHeight - scrollAreaSize;
               isInTopScrollArea = event.clientY < edgeTop;
               isInBottomScrollArea = event.clientY > edgeBottom;
               return isInTopScrollArea || isInBottomScrollArea;
            }),
            throttleTime(25)
         )
         .subscribe((event) => {
            const documentHeight = Math.max(
               document.body.scrollHeight,
               document.body.offsetHeight,
               document.body.clientHeight,
               document.documentElement.scrollHeight,
               document.documentElement.offsetHeight,
               document.documentElement.clientHeight
            );
            const maxScrollY = documentHeight - viewPortHeight;
            const currentScrollY = window.pageYOffset;
            const canScrollUp = currentScrollY > 0;
            const canScrollDown = currentScrollY < maxScrollY;
            let nextScrollY = currentScrollY;
            const maxStep = 75;
            if (isInTopScrollArea && canScrollUp) {
               const intensity = (edgeTop - event.clientY) / scrollAreaSize;
               nextScrollY = nextScrollY - maxStep * intensity;
            } else if (isInBottomScrollArea && canScrollDown) {
               const intensity = (event.clientY - edgeBottom) / scrollAreaSize;
               nextScrollY = nextScrollY + maxStep * intensity;
            }
            nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY));
            if (nextScrollY !== currentScrollY) {
               window.scrollTo({ top: nextScrollY });
               this.scrolling = true;
               clearTimeout(timer);
               timer = setTimeout(() => {
                  this.scrolling = false;
               }, 100);
            }
         });
   }

   public removeScrolling() {
      if (this.globalDragSubscription !== undefined) {
         this.globalDragSubscription.unsubscribe();
      }
   }
}
