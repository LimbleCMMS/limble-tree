import { Injectable } from "@angular/core";

export interface LimbleTreeNode {
   data: unknown;
}

export interface LimbleTreeData {
   nodes: Array<LimbleTreeNode>;
}

@Injectable({
   providedIn: "root"
})
export class LimbleTreeService {}
