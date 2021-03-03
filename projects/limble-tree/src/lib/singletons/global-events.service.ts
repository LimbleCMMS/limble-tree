import { Injectable } from "@angular/core";
import { fromEvent, Observable, Subscription } from "rxjs";
import { filter, throttleTime } from "rxjs/operators";

function getScrollParent(element: HTMLElement): HTMLElement {
   const regex = /(auto|scroll)/;
   const parents = (
      _node: HTMLElement | null,
      parentList: Array<HTMLElement>
   ): Array<HTMLElement> => {
      if (_node === null || _node.parentNode === null) {
         return parentList;
      }
      return parents(_node.parentElement, parentList.concat([_node]));
   };

   const style = (_node: HTMLElement, prop: string) =>
      getComputedStyle(_node, null).getPropertyValue(prop);
   const overflow = (_node: HTMLElement) =>
      style(_node, "overflow") +
      style(_node, "overflow-y") +
      style(_node, "overflow-x");
   const scroll = (_node: HTMLElement) => regex.test(overflow(_node));

   const parentList = parents(element.parentElement, []);
   for (const parent of parentList) {
      if (scroll(parent)) {
         return parent;
      }
   }
   return (
      (document.scrollingElement as HTMLElement) ?? document.documentElement
   );
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
               viewPortHeight = scrollableDiv.clientHeight;
               const viewPortWidth = scrollableDiv.clientWidth;
               let relativeX: number;
               if (
                  window
                     .getComputedStyle(scrollableDiv)
                     .getPropertyValue("position")
                     .toLowerCase() === "fixed"
               ) {
                  relativeX = event.clientX;
                  relativeY = event.clientY;
               } else {
                  const boundingRect = scrollableDiv.getBoundingClientRect();
                  const scrollableDivAncestor = getScrollParent(scrollableDiv);
                  relativeX =
                     event.clientX -
                     (boundingRect.left + scrollableDivAncestor.scrollLeft);
                  relativeY =
                     event.clientY -
                     (boundingRect.top + scrollableDivAncestor.scrollTop);
               }
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
            if (scrollableDiv === null) {
               return;
            }
            const height = scrollableDiv.scrollHeight;
            const maxScrollY = height - viewPortHeight;
            const currentScrollY = scrollableDiv.scrollTop;
            const canScrollUp = currentScrollY > 0;
            const canScrollDown = currentScrollY < maxScrollY;
            let nextScrollY: number;
            const maxStep = 75;
            if (isInTopScrollArea && canScrollUp) {
               const intensity = (edgeTop - relativeY) / scrollAreaSize;
               nextScrollY = currentScrollY - maxStep * intensity;
            } else if (isInBottomScrollArea && canScrollDown) {
               const intensity = (relativeY - edgeBottom) / scrollAreaSize;
               nextScrollY = currentScrollY + maxStep * intensity;
            } else {
               return;
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
