import type { ComponentRef, EventEmitter, Type } from "@angular/core";

export interface HostComponent<UserlandComponent> {
   contentCreated: EventEmitter<UserlandComponent>;
   contentToHost?: Type<UserlandComponent>;
   getHostedContent: () => ComponentRef<UserlandComponent> | undefined;
}
