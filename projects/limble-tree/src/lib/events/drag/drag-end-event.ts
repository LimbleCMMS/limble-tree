import { ComponentRef } from "@angular/core";
import { NodeComponent } from "../../components/node-component.interface";
import { TreeBranch } from "../../core";
import { ContainerTreeNode } from "../../structure";
import { EventConduit } from "../../structure/event-conduit.interface";
import { TreeEvent } from "../../structure/tree-event.interface";

export class DragEndEvent<T> implements TreeEvent {
   private readonly _source: EventConduit;
   private readonly _newParent: ContainerTreeNode<
      ComponentRef<NodeComponent>,
      TreeBranch<T>
   >;
   private readonly _newIndex: number;
   private readonly _oldParent: ContainerTreeNode<
      ComponentRef<NodeComponent>,
      TreeBranch<T>
   >;
   private readonly _oldIndex: number;

   public constructor(
      source: EventConduit,
      endpoints: {
         oldParent: ContainerTreeNode<
            ComponentRef<NodeComponent>,
            TreeBranch<T>
         >;
         oldIndex: number;
         newParent: ContainerTreeNode<
            ComponentRef<NodeComponent>,
            TreeBranch<T>
         >;
         newIndex: number;
      }
   ) {
      this._source = source;
      this._oldParent = endpoints.oldParent;
      this._oldIndex = endpoints.oldIndex;
      this._newParent = endpoints.newParent;
      this._newIndex = endpoints.newIndex;
   }

   public type(): "drag end" {
      return "drag end";
   }

   public source(): EventConduit {
      return this._source;
   }

   public newIndex(): number {
      return this._newIndex;
   }

   public newParent(): ContainerTreeNode<
      ComponentRef<NodeComponent>,
      TreeBranch<T>
   > {
      return this._newParent;
   }

   public oldIndex(): number {
      return this._oldIndex;
   }

   public oldParent(): ContainerTreeNode<
      ComponentRef<NodeComponent>,
      TreeBranch<T>
   > {
      return this._oldParent;
   }
}
