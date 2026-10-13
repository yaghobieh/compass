import { CompassRouter, createRouter } from '../../core';
import type {
  CoreRouteConfig,
  CoreRouterConfig,
  LoaderContext,
  RouteContext,
  RouteParams,
} from '../../types/core';
import { matchRoute } from '../../utils';
import { getComponent, registerComponent, resolveComponentRef, resolveRouteComponents } from '../../utils/componentRegistry';
import { createRoute } from '../../utils/createRoute';

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

export type SvelteRouteConfig = CoreRouteConfig;

export type OutletView = {
  component: unknown;
  params: RouteParams;
  route: CoreRouteConfig;
  context: RouteContext | null;
};

export type SvelteCompassRouter = CompassRouter & {
  getLoaderData: (name?: string) => unknown;
  getParams: () => RouteParams;
};

const normalizeSvelteRoute = (route: CoreRouteConfig): CoreRouteConfig => {
  const guards = [...(route.guards ?? [])];
  if (typeof route.fn === 'function') guards.push(route.fn);
  return {
    ...route,
    guards,
    children: route.children?.map(normalizeSvelteRoute),
  };
};

const loaderContext = (current: RouteContext): LoaderContext => ({
  params: current.params,
  query: current.query,
  request: new Request(`http://localhost${current.path}`),
  signal: new AbortController().signal,
});

export const createCompassRouter = (
  routes: SvelteRouteConfig[],
  options?: Omit<CoreRouterConfig, 'routes'>
): SvelteCompassRouter => {
  const router = createRouter({
    ...options,
    routes: routes.map(normalizeSvelteRoute),
  });
  const loaderData = new Map<string, unknown>();
  let lastKey = '';

  const refreshLoaders = async (current: RouteContext) => {
    const match = matchRoute(router.getRoutes(), current.path);
    if (!match) return;
    for (const route of match.matched) {
      if (typeof route.loader !== 'function') continue;
      const data = await route.loader(loaderContext(current));
      loaderData.set(route.name ?? route.path, data);
    }
  };

  const track = () => {
    const current = router.getCurrentRoute();
    if (!current) return;
    const key = `${current.path}:${JSON.stringify(current.params)}`;
    if (key === lastKey) return;
    lastKey = key;
    void refreshLoaders(current);
  };

  router.subscribe(track);
  track();

  return Object.assign(router, {
    getLoaderData: (name?: string) => {
      if (name) return loaderData.get(name);
      return Object.fromEntries(loaderData);
    },
    getParams: () => router.getCurrentRoute()?.params ?? {},
  });
};

/** Builds a route record. Guards and loaders stay on the record and run through Compass. */
export const Route = (config: SvelteRouteConfig): SvelteRouteConfig => normalizeSvelteRoute(config);

export const Link = (router: CompassRouter) => {
  return {
    props(to: string, replace = false) {
      return {
        href: to,
        onclick: (event: MouseEvent) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
          event.preventDefault();
          router.navigate(to, { replace });
        },
      };
    },
  };
};

const readOutlet = (router: CompassRouter, depth: number): OutletView | null => {
  const current = router.getCurrentRoute();
  if (!current) return null;
  const match = matchRoute(router.getRoutes(), current.path);
  const route = match?.matched[depth];
  if (!route) return null;
  return {
    component: resolveComponentRef(route.component),
    params: current.params,
    route,
    context: current,
  };
};

const mountComponent = (target: HTMLElement, view: OutletView): (() => void) => {
  const component = view.component;
  if (!component || typeof component === 'string') return () => {};

  if (typeof component === 'object' && component && 'mount' in component && typeof component.mount === 'function') {
    const stop = component.mount(target, view);
    return typeof stop === 'function' ? stop : () => {};
  }

  if (typeof component === 'function') {
    try {
      const instance = new (component as new (options: {
        target: HTMLElement;
        props?: Record<string, unknown>;
      }) => { $destroy?: () => void })({
        target,
        props: { params: view.params, route: view.context },
      });
      return () => instance.$destroy?.();
    } catch {
      return () => {};
    }
  }

  return () => {};
};

export const Outlet = (router: CompassRouter, depth = 0) => {
  return {
    read: () => readOutlet(router, depth),
    subscribe(listener: (view: OutletView | null) => void) {
      const emit = () => listener(readOutlet(router, depth));
      emit();
      return router.subscribe(emit);
    },
    mount(target: HTMLElement) {
      let destroy = () => {};
      const render = () => {
        destroy();
        target.replaceChildren();
        const view = readOutlet(router, depth);
        destroy = view ? mountComponent(target, view) : () => {};
      };
      render();
      const unsubscribe = router.subscribe(render);
      return () => {
        unsubscribe();
        destroy();
      };
    },
  };
};

export { createRoute, registerComponent, getComponent, resolveRouteComponents };
