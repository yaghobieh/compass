import { ChangeDetectorRef, ElementRef, InjectionToken, NgZone, inject } from '@angular/core';
import { CompassRouter, createRouter } from '../../core';
import type {
  CoreRouteConfig,
  CoreRouterConfig,
  GuardFn,
  GuardResult,
  RouteContext,
  RouteParams,
} from '../../types/core';
import { matchRoute } from '../../utils';
import { getComponent, registerComponent, resolveComponentRef, resolveRouteComponents } from '../../utils/componentRegistry';
import { createRoute } from '../../utils/createRoute';

export const COMPASS_ROUTER = new InjectionToken<CompassRouter>('FORGE_COMPASS_ROUTER');

export type AngularHook = (
  context: RouteContext
) => boolean | GuardResult | void | Promise<boolean | GuardResult | void>;

export type AngularResolver<T = unknown> = (context: RouteContext) => T | Promise<T>;

const coerceGuard = (result: boolean | GuardResult | void): GuardResult => {
  if (typeof result === 'boolean') {
    return result ? { allowed: true } : { allowed: false };
  }
  if (result && typeof result === 'object' && 'allowed' in result) {
    return result;
  }
  return { allowed: true };
};

const toGuardFn = (hook: AngularHook): GuardFn => {
  return async (context) => coerceGuard(await hook(context));
};

const toGuards = (value: unknown): (GuardFn | string)[] => {
  if (value == null) return [];
  const list = Array.isArray(value) ? value : [value];
  const guards: (GuardFn | string)[] = [];
  for (const item of list) {
    if (typeof item === 'string') guards.push(item);
    else if (typeof item === 'function') guards.push(toGuardFn(item as AngularHook));
  }
  return guards;
};

export const canActivate = (hook: AngularHook): GuardFn => toGuardFn(hook);
export const canActivateChild = (hook: AngularHook): GuardFn => toGuardFn(hook);
export const canDeactivate = (hook: AngularHook): GuardFn => toGuardFn(hook);
export const canMatch = (hook: AngularHook): GuardFn => toGuardFn(hook);
export const resolve = <T>(resolver: AngularResolver<T>): AngularResolver<T> => resolver;

const prepareAngularRoute = (route: CoreRouteConfig): CoreRouteConfig => {
  const guards = [
    ...(route.guards ?? []),
    ...toGuards(route.canActivate),
    ...toGuards(route.canActivateChild),
    ...toGuards(route.canMatch),
  ];
  if (typeof route.fn === 'function') guards.push(route.fn);

  return {
    ...route,
    guards,
    canDeactivate: toGuards(route.canDeactivate),
    children: route.children?.map(prepareAngularRoute),
  };
};

const unwrapLoaded = (loaded: unknown): unknown => {
  if (loaded && typeof loaded === 'object' && 'default' in loaded) {
    return (loaded as { default: unknown }).default;
  }
  return loaded;
};

const loadRouteComponent = async (route: CoreRouteConfig): Promise<unknown> => {
  const resolved = resolveComponentRef(route.component);
  if (resolved && typeof resolved !== 'string') return resolved;
  if (!route.loadComponent) return resolved;
  const loaded = unwrapLoaded(await route.loadComponent());
  route.component = loaded;
  return loaded;
};

const runResolvers = async (
  route: CoreRouteConfig,
  context: RouteContext
): Promise<Record<string, unknown>> => {
  if (!route.resolve || typeof route.resolve !== 'object') return {};
  const entries = Object.entries(route.resolve as Record<string, unknown>);
  const data: Record<string, unknown> = {};
  for (const [key, resolver] of entries) {
    if (typeof resolver === 'function') {
      data[key] = await (resolver as AngularResolver)(context);
    }
  }
  return data;
};

export type CompassProvider = {
  provide: InjectionToken<CompassRouter>;
  useFactory: () => CompassRouter;
};

export const provideCompassRouter = (
  routes: CoreRouteConfig[],
  options?: Omit<CoreRouterConfig, 'routes'>
): CompassProvider[] => {
  return [
    {
      provide: COMPASS_ROUTER,
      useFactory: () => createRouter({
        ...options,
        routes: routes.map(prepareAngularRoute),
      }),
    },
  ];
};

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
export class CompassOutlet {
  readonly router = inject<CompassRouter>(COMPASS_ROUTER);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject<NgZone>(NgZone);
  private readonly cdr = inject<ChangeDetectorRef>(ChangeDetectorRef);
  private stop = (): void => {};

  depth = 0;
  activeComponent: unknown = null;
  params: RouteParams = {};
  data: Record<string, unknown> = {};

  ngOnInit(): void {
    this.stop = this.router.subscribe(() => {
      this.zone.run(() => {
        void this.sync();
      });
    });
    void this.sync();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private async sync(): Promise<void> {
    const current = this.router.getCurrentRoute();
    if (!current) {
      this.activeComponent = null;
      this.params = {};
      this.data = {};
      this.cdr.markForCheck();
      return;
    }

    const match = matchRoute(this.router.getRoutes(), current.path);
    const route = match?.matched[this.depth];
    if (!route) {
      this.activeComponent = null;
      this.cdr.markForCheck();
      return;
    }

    this.params = current.params;
    this.data = await runResolvers(route, current);
    this.activeComponent = await loadRouteComponent(route);
    const element = this.host.nativeElement;
    if (element?.dataset) {
      const name = route.name ?? route.path;
      element.dataset.compassOutlet = name;
    }
    this.cdr.markForCheck();
  }
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
export class CompassLink {
  private readonly router = inject<CompassRouter>(COMPASS_ROUTER);
  to = '';
  replace = false;

  onClick(event: MouseEvent): void {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    this.router.navigate(this.to, { replace: this.replace });
  }
}

export const compassOutletMeta = {
  selector: 'compass-outlet',
  standalone: true,
  template: '<ng-container *ngComponentOutlet="activeComponent"></ng-container>',
};

export const compassLinkMeta = {
  selector: 'a[compassLink]',
  standalone: true,
  host: { '(click)': 'onClick($event)' },
};

export { createRoute, registerComponent, getComponent, resolveRouteComponents };
