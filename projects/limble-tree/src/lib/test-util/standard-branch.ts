import { TreeBranch } from "../core/tree-branch/tree-branch";
import { TreeRoot } from "../core/tree-root/tree-root";
import { EmptyComponent } from "./empty.component";
import { getViewContainer } from "./virtual";

export function getStandardBranch(): TreeBranch<EmptyComponent> {
   return new TreeBranch(
      new TreeRoot<EmptyComponent>(getViewContainer()),
      EmptyComponent
   );
}
