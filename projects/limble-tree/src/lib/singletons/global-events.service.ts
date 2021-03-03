import { Injectable } from "@angular/core";
import { fromEvent, Observable, Subscription } from "rxjs";
import { filter, throttleTime } from "rxjs/operators";

function getScrollParent(element: HTMLElement | null): HTMLElement | null {
   if (element === null) {
      return null;
   }

   if (element.scrollHeight > element.clientHeight) {
      return element;
   } else {
      return getScrollParent(element.parentElement);
   }
}

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
      let scrollableDiv: HTMLElement | null;
      let relativeY: number;
      this.globalDragSubscription = this.globalDrag$
         .pipe(
            throttleTime(25),
            filter((event) => {
               if (!event.target) {
                  return false;
               }
               scrollableDiv = getScrollParent(event.target as HTMLElement);
               if (scrollableDiv === null) {
                  return false;
               }
               viewPortHeight = scrollableDiv.clientHeight;
               const viewPortWidth = scrollableDiv.clientWidth;
               const boundingRect = scrollableDiv.getBoundingClientRect();
               const relativeX =
                  event.clientX - (boundingRect.left + window.scrollX);
               relativeY = event.clientY - (boundingRect.top + window.scrollY);
               if (
                  relativeX < 0 ||
                  relativeX > viewPortWidth ||
                  relativeY < 0 ||
                  relativeY > viewPortHeight
               ) {
                  //Outside of scrollable div
                  return false;
               }
               scrollAreaSize = Math.max(viewPortHeight * 0.1, 100);
               edgeTop = scrollAreaSize;
               edgeBottom = viewPortHeight - scrollAreaSize;
               isInTopScrollArea = relativeY < edgeTop;
               isInBottomScrollArea = relativeY > edgeBottom;
               return isInTopScrollArea || isInBottomScrollArea;
            })
         )
         .subscribe(() => {
            console.log(isInTopScrollArea, isInBottomScrollArea);
            if (scrollableDiv === null) {
               return;
            }
            const height = scrollableDiv.scrollHeight;
            const maxScrollY = height - viewPortHeight;
            const currentScrollY = scrollableDiv.scrollTop;
            const canScrollUp = currentScrollY > 0;
            const canScrollDown = currentScrollY < maxScrollY;
            let nextScrollY = currentScrollY;
            const maxStep = 75;
            if (isInTopScrollArea && canScrollUp) {
               const intensity = (edgeTop - relativeY) / scrollAreaSize;
               nextScrollY = nextScrollY - maxStep * intensity;
            } else if (isInBottomScrollArea && canScrollDown) {
               const intensity = (relativeY - edgeBottom) / scrollAreaSize;
               nextScrollY = nextScrollY + maxStep * intensity;
            }
            nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY));
            if (nextScrollY !== currentScrollY) {
               scrollableDiv.scrollTo({ top: nextScrollY });
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
