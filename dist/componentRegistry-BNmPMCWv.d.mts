import { C as CoreRouteConfig, j as RouteFn } from './core-DKMffvjs.mjs';

type CreateRouteObject = Partial<Omit<CoreRouteConfig, 'path' | 'fn' | 'component'>> & {
    path: string;
    name?: string;
    fn?: RouteFn;
    component?: unknown;
};
declare function createRoute<TComponent>(path: string, component: TComponent, options?: Partial<Omit<CoreRouteConfig, 'path' | 'component'>>): CoreRouteConfig & {
    component: TComponent;
};
declare function createRoute(config: CreateRouteObject): CoreRouteConfig;
declare function createRoute(spec: string): CoreRouteConfig;

declare const registerComponent: (name: string, component: unknown) => void;
declare const getComponent: (name: string) => unknown | undefined;
declare const resolveRouteComponents: <T extends CoreRouteConfig>(routes: T[]) => T[];

export { resolveRouteComponents as a, createRoute as c, getComponent as g, registerComponent as r };
