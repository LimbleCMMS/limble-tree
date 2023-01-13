import { ComponentRef, Type } from "@angular/core";

export interface HostComponent<UserlandComponent> {
   contentToHost?: Type<UserlandComponent>;
   getHostedContent: () => ComponentRef<UserlandComponent> | undefined;
}
