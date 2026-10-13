import { C as CompassRouter } from '../Router-BBCgAzWl.mjs';
import { R as RouteParams, C as CoreRouteConfig, a as RouteContext, c as CoreRouterConfig } from '../core-DKMffvjs.mjs';
export { c as createRoute, g as getComponent, r as registerComponent, a as resolveRouteComponents } from '../componentRegistry-BNmPMCWv.mjs';

/**
 * Svelte client adapter.
 *
 * The package build does not compile `.svelte` files. `Route`, `Link`, and `Outlet`
 * are controllers the app wraps. A compiled Svelte component can be mounted when it
 * is constructable with `{ target, props }` (`$destroy`) or when it exposes
 * `mount(target, props) => stop`.
 *
 * There is no file-based page routing.
 */
type SvelteRouteConfig = CoreRouteConfig;
type OutletView = {
    component: unknown;
    params: RouteParams;
    route: CoreRouteConfig;
    context: RouteContext | null;
};
type SvelteCompassRouter = CompassRouter & {
    getLoaderData: (name?: string) => unknown;
    getParams: () => RouteParams;
};
declare const createCompassRouter: (routes: SvelteRouteConfig[], options?: Omit<CoreRouterConfig, "routes">) => SvelteCompassRouter;
/** Builds a route record. Guards and loaders stay on the record and run through Compass. */
declare const Route: (config: SvelteRouteConfig) => SvelteRouteConfig;
declare const Link: (router: CompassRouter) => {
    props(to: string, replace?: boolean): {
        href: string;
        onclick: (event: MouseEvent) => void;
    };
};
declare const Outlet: (router: CompassRouter, depth?: number) => {
    read: () => OutletView | null;
    subscribe(listener: (view: OutletView | null) => void): () => void;
    mount(target: HTMLElement): () => void;
};

export { Link, Outlet, type OutletView, Route, type SvelteCompassRouter, type SvelteRouteConfig, createCompassRouter };
