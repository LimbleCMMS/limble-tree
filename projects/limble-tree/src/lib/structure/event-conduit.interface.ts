import { Observable } from "rxjs";
import { TreeEvent } from "./tree-event.interface";

export interface EventConduit {
   dispatch: (event: TreeEvent) => void;
   events: () => Observable<TreeEvent>;
}
