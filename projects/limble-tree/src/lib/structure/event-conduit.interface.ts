import type { Observable } from "rxjs";
import type { TreeEvent } from "./tree-event.interface";

export interface EventConduit {
   dispatch: (event: TreeEvent) => void;
   events: () => Observable<TreeEvent>;
}
