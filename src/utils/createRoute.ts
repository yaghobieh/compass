import type { CoreRouteConfig, RouteFn } from '../types/core';
import { resolveComponentRef } from './componentRegistry';
import { parseRouteSpec } from './routeSpec';

export type CreateRouteObject = Partial<Omit<CoreRouteConfig, 'path' | 'fn' | 'component'>> & {
  path: string;
  name?: string;
  fn?: RouteFn;
  component?: unknown;
};

export function createRoute<TComponent>(
  path: string,
  component: TComponent,
  options?: Partial<Omit<CoreRouteConfig, 'path' | 'component'>>
): CoreRouteConfig & { component: TComponent };
export function createRoute(config: CreateRouteObject): CoreRouteConfig;
export function createRoute(spec: string): CoreRouteConfig;
export function createRoute(
  pathOrConfig: string | CreateRouteObject,
  component?: unknown,
  options?: Partial<Omit<CoreRouteConfig, 'path' | 'component'>>
): CoreRouteConfig {
  if (pathOrConfig !== null && typeof pathOrConfig === 'object') {
    if (!pathOrConfig.path) {
      throw new Error('createRoute object requires a path.');
    }
    const { component: objectComponent, ...rest } = pathOrConfig;
    return {
      ...rest,
      path: pathOrConfig.path,
      component: resolveComponentRef(objectComponent),
    };
  }

  if (arguments.length === 1) {
    const parsed = parseRouteSpec(pathOrConfig);
    return {
      name: parsed.name,
      fn: parsed.fn,
      path: parsed.path,
      component: resolveComponentRef(parsed.component),
    };
  }

  return {
    path: pathOrConfig,
    component: resolveComponentRef(component),
    ...options,
  };
}
