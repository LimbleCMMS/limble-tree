import type { ComponentRef, EventEmitter, Type } from "@angular/core";

export interface HostComponent<UserlandComponent> {
   contentCreated: EventEmitter<ComponentRef<UserlandComponent>>;
   contentToHost?: Type<UserlandComponent>;
   getHostedContent: () => ComponentRef<UserlandComponent> | undefined;
}
