import { Injectable } from "@angular/core";
import { Branch } from "branches";

@Injectable()
export class TempService {
   private _tempData: Branch<any> | undefined;

   public set(value: Branch<any>) {
      this._tempData = value;
   }

   public get() {
      return this._tempData;
   }

   public delete() {
      this._tempData = undefined;
   }
}
