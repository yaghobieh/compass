import { C as CoreRouteConfig, c as CoreRouterConfig, R as RouteParams, a as RouteContext } from '../core-DKMffvjs.js';
import { C as CompassRouter } from '../Router-D264gYl-.js';
export { c as createRoute, g as getComponent, r as registerComponent, a as resolveRouteComponents } from '../componentRegistry-BIO702m7.js';

declare const COMPASS_ROUTER_KEY: unique symbol;
type CompassVueRouter = CompassRouter & {
    install(app: {
        provide(key: symbol, value: unknown): void;
    }): void;
};
declare const createCompassRouter: (routes: CoreRouteConfig[], options?: Omit<CoreRouterConfig, "routes">) => CompassVueRouter;
declare const useRoute: () => {
    readonly value: RouteContext | null;
};
declare const useParams: () => {
    readonly value: RouteParams;
};
declare const CompassView: any;
declare const CompassLink: any;

export { COMPASS_ROUTER_KEY, CompassLink, CompassView, type CompassVueRouter, createCompassRouter, useParams, useRoute };
