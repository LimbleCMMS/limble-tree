import { Component, ViewChild } from "@angular/core";
import {
   LimbleTreeRootComponent,
   LimbleTreeData,
   LimbleTreeOptions,
   LimbleTreeNode,
   TreeDrop
} from "@limble/limble-tree";
import { TreeItemAltComponent } from "./tree-item-alt/tree-item-alt.component";
import { TreeItemComponent } from "./tree-item/tree-item.component";

@Component({
   selector: "app-root",
   templateUrl: "./app.component.html",
   styleUrls: ["./app.component.scss"]
})
export class AppComponent {
   @ViewChild("tree") limbleTree: LimbleTreeRootComponent | undefined;

   public treeData1: LimbleTreeData = [
      {
         value1: "this thing",
         collapsed: false,
         component: {
            class: TreeItemComponent,
            bindings: { collapsible: true }
         },
         nodes: [
            { value1: "other thing" },
            {
               value1:
                  "another thing. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
               nodes: [{ value1: "his thing" }, { value1: "her thing" }]
            }
         ]
      },
      {
         value1:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
      {
         component: {
            class: TreeItemAltComponent,
            bindings: { bgColor: "#0070cc" }
         },
         value1: "these things",
         nodes: [{ value1: "a thing" }]
      },
      {
         component: {
            class: TreeItemAltComponent,
            bindings: { bgColor: "#00a329" }
         },
         value1: "those things"
      }
   ];

   public treeData2: LimbleTreeData = [
      {
         value1: "Test1",
         nodes: [{ value1: "Test2" }]
      },
      {
         value1: "Test3",
         nodes: [{ value1: "Test4" }, { value1: "Test5" }]
      }
   ];

   public treeOptions: LimbleTreeOptions = {
      defaultComponent: { class: TreeItemComponent },
      indent: 60
   };

   public limbleTreeDataString: string;

   constructor() {
      this.limbleTreeDataString = JSON.stringify(this.treeData1, null, 2);
      for (let index = 0; index < 1000; index++) {
         this.treeData1.push({ value1: "my thing" });
      }
   }

   public addNode(node: LimbleTreeNode) {
      this.treeData1.push(node);
      this.reRenderTree();
   }

   public treeChangeHandler() {
      this.limbleTreeDataString = JSON.stringify(this.treeData1, null, 2);
   }

   public treeDropHandler(drop: TreeDrop) {
      console.log("dropped!", drop);
   }

   private reRenderTree() {
      if (this.limbleTree !== undefined) {
         this.limbleTree.update();
      }
   }
}
