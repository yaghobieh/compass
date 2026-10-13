import type { CoreRouteConfig } from '../types/core';

const registry = new Map<string, unknown>();

export const registerComponent = (name: string, component: unknown): void => {
  registry.set(name, component);
};

export const getComponent = (name: string): unknown | undefined => {
  return registry.get(name);
};

/** Resolve a registry name. Unknown names stay as strings so adapters can resolve at render time. */
export const resolveComponentRef = (component: unknown): unknown => {
  if (typeof component !== 'string') return component;
  return registry.get(component) ?? component;
};

export const resolveRouteComponents = <T extends CoreRouteConfig>(routes: T[]): T[] => {
  return routes.map((route) => ({
    ...route,
    component: resolveComponentRef(route.component),
    layout: resolveComponentRef(route.layout),
    children: route.children
      ? resolveRouteComponents(route.children as T[])
      : route.children,
  }));
};
