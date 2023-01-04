import { Observable } from "rxjs";

export interface EventConduit<T> {
   event: (event: T) => void;
   events: () => Observable<T>;
}
