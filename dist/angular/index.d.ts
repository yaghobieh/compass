import { InjectionToken } from '@angular/core';
import { C as CompassRouter } from '../Router-D264gYl-.js';
import { a as RouteContext, g as GuardResult, C as CoreRouteConfig, R as RouteParams, d as GuardFn, c as CoreRouterConfig } from '../core-DKMffvjs.js';
export { c as createRoute, g as getComponent, r as registerComponent, a as resolveRouteComponents } from '../componentRegistry-BIO702m7.js';

declare const COMPASS_ROUTER: InjectionToken<CompassRouter<CoreRouteConfig>>;
type AngularHook = (context: RouteContext) => boolean | GuardResult | void | Promise<boolean | GuardResult | void>;
type AngularResolver<T = unknown> = (context: RouteContext) => T | Promise<T>;
declare const canActivate: (hook: AngularHook) => GuardFn;
declare const canActivateChild: (hook: AngularHook) => GuardFn;
declare const canDeactivate: (hook: AngularHook) => GuardFn;
declare const canMatch: (hook: AngularHook) => GuardFn;
declare const resolve: <T>(resolver: AngularResolver<T>) => AngularResolver<T>;
type CompassProvider = {
    provide: InjectionToken<CompassRouter>;
    useFactory: () => CompassRouter;
};
declare const provideCompassRouter: (routes: CoreRouteConfig[], options?: Omit<CoreRouterConfig, "routes">) => CompassProvider[];
/**
 * Outlet controller. Declare it in the app so the Angular compiler owns the selector:
 *
 * ```ts
 * @Component({
 *   selector: 'compass-outlet',
 *   standalone: true,
 *   template: '<ng-container *ngComponentOutlet="activeComponent"></ng-container>',
 * })
 * export class AppOutlet extends CompassOutlet {}
 * ```
 *
 * Nested outlets set `depth` (0 at the root).
 */
declare class CompassOutlet {
    readonly router: CompassRouter<CoreRouteConfig>;
    private readonly host;
    private readonly zone;
    private readonly cdr;
    private stop;
    depth: number;
    activeComponent: unknown;
    params: RouteParams;
    data: Record<string, unknown>;
    ngOnInit(): void;
    ngOnDestroy(): void;
    private sync;
}
/**
 * Link controller. Declare it in the app:
 *
 * ```ts
 * @Directive({
 *   selector: 'a[compassLink]',
 *   standalone: true,
 *   host: { '(click)': 'onClick($event)' },
 * })
 * export class AppLink extends CompassLink {
 *   @Input() override to = '';
 *   @Input() override replace = false;
 * }
 * ```
 */
declare class CompassLink {
    private readonly router;
    to: string;
    replace: boolean;
    onClick(event: MouseEvent): void;
}
declare const compassOutletMeta: {
    selector: string;
    standalone: boolean;
    template: string;
};
declare const compassLinkMeta: {
    selector: string;
    standalone: boolean;
    host: {
        '(click)': string;
    };
};

export { type AngularHook, type AngularResolver, COMPASS_ROUTER, CompassLink, CompassOutlet, type CompassProvider, canActivate, canActivateChild, canDeactivate, canMatch, compassLinkMeta, compassOutletMeta, provideCompassRouter, resolve };
