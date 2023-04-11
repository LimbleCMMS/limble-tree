import { TreeBranch, TreeRoot } from "../core";
import { EmptyComponent } from "./empty.component";
import { getViewContainer } from "./virtual";

export function getStandardBranch(): TreeBranch<EmptyComponent> {
   return new TreeBranch(new TreeRoot<EmptyComponent>(getViewContainer()), {
      component: EmptyComponent
   });
}
