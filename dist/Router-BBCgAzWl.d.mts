import { C as CoreRouteConfig, c as CoreRouterConfig, N as NavigateOptions, a as RouteContext, h as RouterState, R as RouteParams, G as Guard, i as RouterListener, D as DevToolsCallback } from './core-DKMffvjs.mjs';

declare class CompassRouter<TRoute extends CoreRouteConfig = CoreRouteConfig> {
    private config;
    private state;
    private listeners;
    private devToolsCallback;
    private guardRegistry;
    private unlisten;
    private _routes;
    constructor(config: CoreRouterConfig<TRoute>);
    private get routes();
    private guardsFor;
    private leaveGuards;
    private registerForDevTools;
    private setupHistoryListener;
    private getCurrentPath;
    private handleInitialRoute;
    private updateState;
    private notify;
    private log;
    private runGuards;
    private navigateInternal;
    private updateBrowserHistory;
    private handleScrollBehavior;
    navigate: (to: string, options?: NavigateOptions) => void;
    push: (to: string, options?: NavigateOptions) => void;
    replace: (to: string, options?: NavigateOptions) => void;
    back: () => void;
    forward: () => void;
    go: (delta: number) => void;
    getCurrentRoute: () => RouteContext | null;
    getState: () => RouterState;
    getRoutes: () => TRoute[];
    addRoute: (route: TRoute, parentName?: string) => void;
    removeRoute: (name: string) => void;
    hasRoute: (name: string) => boolean;
    resolve: (nameOrPath: string, params?: RouteParams) => string;
    registerGuard: (guard: Guard) => void;
    subscribe: (listener: RouterListener) => (() => void);
    setDevToolsCallback: (callback: DevToolsCallback | null) => void;
    destroy: () => void;
}
declare const createRouter: <TRoute extends CoreRouteConfig = CoreRouteConfig>(config: CoreRouterConfig<TRoute>) => CompassRouter<TRoute>;

export { CompassRouter as C, createRouter as c };
