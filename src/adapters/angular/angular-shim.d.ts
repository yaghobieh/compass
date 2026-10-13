declare module '@angular/core' {
  export class InjectionToken<T> {
    constructor(description: string);
  }
  export function inject<T>(token: unknown): T;
  export class ElementRef<T = unknown> {
    nativeElement: T;
  }
  export class NgZone {
    run<T>(fn: () => T): T;
  }
  export class ChangeDetectorRef {
    markForCheck(): void;
  }
}
