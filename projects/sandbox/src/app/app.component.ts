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
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt nunc pulvinar sapien et ligula ullamcorper. Praesent elementum facilisis leo vel fringilla est. Euismod lacinia at quis risus sed vulputate odio. Non sodales neque sodales ut etiam sit amet nisl purus. Gravida quis blandit turpis cursus in hac habitasse. Mi tempus imperdiet nulla malesuada pellentesque. Facilisis mauris sit amet massa vitae tortor condimentum lacinia quis. Quis imperdiet massa tincidunt nunc pulvinar sapien et ligula. Integer malesuada nunc vel risus commodo viverra maecenas. Non sodales neque sodales ut etiam sit amet nisl purus. Volutpat ac tincidunt vitae semper quis lectus nulla. Et leo duis ut diam. Pellentesque massa placerat duis ultricies lacus sed turpis. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus. Mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien. Volutpat maecenas volutpat blandit aliquam. Facilisis gravida neque convallis a cras semper auctor neque vitae. Rhoncus mattis rhoncus urna neque viverra justo nec ultrices. Ipsum dolor sit amet consectetur. Suspendisse faucibus interdum posuere lorem. Libero enim sed faucibus turpis in. Facilisi nullam vehicula ipsum a arcu cursus. In pellentesque massa placerat duis ultricies lacus sed. In vitae turpis massa sed elementum tempus. Scelerisque fermentum dui faucibus in ornare quam viverra. Diam vel quam elementum pulvinar etiam non quam. Quisque sagittis purus sit amet volutpat. Ornare arcu dui vivamus arcu felis bibendum ut tristique et. Etiam non quam lacus suspendisse faucibus interdum posuere. Purus gravida quis blandit turpis cursus in hac habitasse. Nisl nunc mi ipsum faucibus vitae aliquet nec. Duis ultricies lacus sed turpis. Proin libero nunc consequat interdum. Nunc pulvinar sapien et ligula ullamcorper malesuada. Turpis massa tincidunt dui ut ornare lectus. In metus vulputate eu scelerisque felis imperdiet proin fermentum. Ac tortor dignissim convallis aenean. Pharetra pharetra massa massa ultricies mi quis hendrerit dolor magna. Ultricies lacus sed turpis tincidunt id aliquet risus. Adipiscing bibendum est ultricies integer quis auctor. Diam in arcu cursus euismod quis. Justo eget magna fermentum iaculis eu non. Porttitor eget dolor morbi non arcu risus quis varius quam. Volutpat consequat mauris nunc congue nisi vitae suscipit tellus. Rhoncus mattis rhoncus urna neque viverra justo. Egestas fringilla phasellus faucibus scelerisque. Sed enim ut sem viverra aliquet. Risus pretium quam vulputate dignissim suspendisse in. Vitae congue mauris rhoncus aenean vel. Massa sed elementum tempus egestas. Tempus quam pellentesque nec nam aliquam sem. Id consectetur purus ut faucibus pulvinar elementum integer enim. Nisi lacus sed viverra tellus. Tincidunt ornare massa eget egestas purus viverra accumsan in. Orci porta non pulvinar neque laoreet suspendisse interdum. Orci a scelerisque purus semper eget duis. Lectus magna fringilla urna porttitor rhoncus dolor. Duis at tellus at urna condimentum mattis pellentesque id. Amet purus gravida quis blandit turpis cursus in hac. Nulla at volutpat diam ut venenatis tellus in metus vulputate. Turpis tincidunt id aliquet risus feugiat in ante metus dictum. Massa tincidunt nunc pulvinar sapien et ligula. Condimentum vitae sapien pellentesque habitant. A diam maecenas sed enim. Enim ut tellus elementum sagittis vitae et leo. Pretium lectus quam id leo in vitae turpis massa sed. Nulla aliquet porttitor lacus luctus accumsan tortor. Tincidunt id aliquet risus feugiat in ante metus dictum at. Tincidunt eget nullam non nisi est sit amet facilisis. Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna. Metus dictum at tempor commodo ullamcorper. Nulla facilisi cras fermentum odio eu feugiat. At tellus at urna condimentum mattis pellentesque id nibh tortor. Id aliquet risus feugiat in ante metus. Gravida dictum fusce ut placerat orci. Vel pretium lectus quam id leo in vitae. Id donec ultrices tincidunt arcu non sodales neque sodales ut. In aliquam sem fringilla ut morbi tincidunt augue interdum velit. Dui ut ornare lectus sit amet. Sed velit dignissim sodales ut eu. Morbi tincidunt augue interdum velit euismod in pellentesque massa."
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
