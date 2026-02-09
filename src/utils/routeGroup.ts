import type { RouteConfig, RouteGroupConfig, Guard, GuardFn, RouteComponent, RouteMeta } from '../types';

export const routeGroup = (config: RouteGroupConfig): RouteConfig[] => {
  const { guards, layout, meta, fallback, errorBoundary, children } = config;

  return children.map((child) => ({
    ...child,
    guards: [...(guards || []), ...(child.guards || [])],
    layout: child.layout || layout,
    meta: { ...meta, ...child.meta },
    fallback: child.fallback || fallback,
    errorBoundary: child.errorBoundary || errorBoundary,
    children: child.children?.map((grandChild) => ({
      ...grandChild,
      guards: [...(guards || []), ...(child.guards || []), ...(grandChild.guards || [])],
      meta: { ...meta, ...child.meta, ...grandChild.meta },
      fallback: grandChild.fallback || child.fallback || fallback,
      errorBoundary: grandChild.errorBoundary || child.errorBoundary || errorBoundary,
    })),
  }));
};

export const mergeRouteGroups = (...groups: RouteConfig[][]): RouteConfig[] => {
  return groups.flat();
};

export const createRoute = (
  path: string,
  component: RouteComponent,
  options?: Partial<Omit<RouteConfig, 'path' | 'component'>>
): RouteConfig => ({
  path,
  component,
  ...options,
});

export const createRedirect = (
  from: string,
  to: string,
  options?: { guards?: (Guard | GuardFn | string)[]; meta?: RouteMeta }
): RouteConfig => ({
  path: from,
  redirect: to,
  ...options,
});

