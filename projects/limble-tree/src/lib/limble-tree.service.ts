import { Injectable } from "@angular/core";

export interface LimbleTreeNode {
   nodes?: Array<LimbleTreeNode>;
   data: unknown;
}

export interface LimbleTreeData {
   nodes: Array<LimbleTreeNode>;
   options?: {};
}

@Injectable({
   providedIn: "root"
})
export class LimbleTreeService {}
