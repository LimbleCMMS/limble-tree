import { ComponentRef } from "@angular/core";
import { NodeComponent } from "../../components/node-component.interface";
import { TreeBranch } from "../../core";
import { ContainerTreeNode } from "../../structure/container-tree-node.interface";
import { EventConduit } from "../../structure/event-conduit.interface";
import { TreeEvent } from "../../structure/tree-event.interface";

export class DropEvent<T> implements TreeEvent {
   private readonly _source: EventConduit;
   private readonly _parent: ContainerTreeNode<
      ComponentRef<NodeComponent>,
      TreeBranch<T>
   >;
   private readonly _index: number;

   public constructor(
      source: EventConduit,
      parent: ContainerTreeNode<ComponentRef<NodeComponent>, TreeBranch<T>>,
      index: number
   ) {
      this._source = source;
      this._parent = parent;
      this._index = index;
   }

   public type(): "drag end" {
      return "drag end";
   }

   public source(): EventConduit {
      return this._source;
   }

   public index(): number {
      return this._index;
   }

   public parent(): ContainerTreeNode<
      ComponentRef<NodeComponent>,
      TreeBranch<T>
   > {
      return this._parent;
   }
}
