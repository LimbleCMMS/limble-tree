import { Injectable } from "@angular/core";

@Injectable()
export class TempService {
   private _tempData: unknown;

   public set(value: unknown) {
      this._tempData = value;
   }

   public get() {
      return this._tempData;
   }

   public delete() {
      this._tempData = undefined;
   }
}
