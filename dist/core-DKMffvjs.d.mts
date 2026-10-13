/** Framework-agnostic route types. Component values are unknown so Vue, Angular, and Svelte do not import React. */
type GuardResult = {
    allowed: true;
} | {
    allowed: false;
    redirect?: string;
    reason?: string;
};
type GuardFn = (context: RouteContext) => GuardResult | Promise<GuardResult>;
type Guard = {
    name: string;
    check: GuardFn;
    onDeny?: (result: GuardResult, context: RouteContext) => void;
};
type RouteParams = Record<string, string>;
type QueryParams = Record<string, string | string[] | undefined>;
type RouteMeta = {
    title?: string;
    description?: string;
    keywords?: string[];
    og?: {
        title?: string;
        description?: string;
        image?: string;
    };
    [key: string]: unknown;
};
type RouteContext = {
    path: string;
    params: RouteParams;
    query: QueryParams;
    hash: string;
    state?: unknown;
    meta: RouteMeta;
};
type LoaderContext = {
    params: RouteParams;
    query: QueryParams;
    request: Request;
    signal: AbortSignal;
};
type LoaderFn<T = unknown> = (context: LoaderContext) => T | Promise<T>;
type ActionContext = {
    params: RouteParams;
    request: Request;
    formData: FormData;
};
type ActionFn<T = unknown> = (context: ActionContext) => T | Promise<T>;
type ActionResult<T = unknown> = {
    data?: T;
    error?: Error;
    status: 'idle' | 'submitting' | 'success' | 'error';
};
type RevalidationContext = {
    currentUrl: string;
    nextUrl: string;
    formMethod?: string;
    formAction?: string;
    defaultShouldRevalidate: boolean;
};
/** Guard or loader name, or a guard function. String form of createRoute always stores a name. */
type RouteFn = string | GuardFn;
type CoreRouteConfig = {
    path: string;
    name?: string;
    fn?: RouteFn;
    component?: unknown;
    children?: CoreRouteConfig[];
    guards?: (Guard | GuardFn | string)[];
    meta?: RouteMeta;
    redirect?: string;
    index?: boolean;
    layout?: unknown;
    fallback?: unknown;
    element?: unknown;
    errorBoundary?: unknown;
    /** Vue-style enter hook. Adapters map this onto Compass guards. */
    beforeEnter?: Guard | GuardFn | string | Array<Guard | GuardFn | string>;
    canActivate?: unknown;
    canActivateChild?: unknown;
    canDeactivate?: unknown;
    canMatch?: unknown;
    resolve?: unknown;
    loadComponent?: () => Promise<unknown>;
    loader?: LoaderFn;
    action?: ActionFn;
    shouldRevalidate?: (context: RevalidationContext) => boolean;
    viewTransitionName?: string;
    parallel?: boolean;
    slot?: string;
};
type CoreRouterConfig<TRoute extends CoreRouteConfig = CoreRouteConfig> = {
    routes?: TRoute[];
    basePath?: string;
    mode?: 'history' | 'hash';
    scrollBehavior?: 'top' | 'preserve' | ((to: RouteContext, from: RouteContext | null) => void);
    defaultGuards?: (Guard | GuardFn)[];
    onNavigate?: (to: RouteContext, from: RouteContext | null) => void;
    onGuardDeny?: (result: GuardResult, context: RouteContext) => void;
    notFound?: unknown;
    loading?: unknown;
};
type NavigateOptions = {
    replace?: boolean;
    state?: unknown;
    preserveQuery?: boolean;
    preserveHash?: boolean;
    skipHistoryUpdate?: boolean;
};
type RouterState = {
    currentRoute: RouteContext | null;
    previousRoute: RouteContext | null;
    isNavigating: boolean;
    isLoading: boolean;
    error: Error | null;
    history: RouteContext[];
};
type MatchResult<TRoute extends CoreRouteConfig = CoreRouteConfig> = {
    route: TRoute;
    params: RouteParams;
    matched: TRoute[];
} | null;
type BreadcrumbItem = {
    name: string;
    path: string;
    meta?: RouteMeta;
    isActive: boolean;
};
type CompassLogEntry = {
    id: string;
    timestamp: number;
    type: 'navigate' | 'guard' | 'error' | 'redirect' | 'load';
    from?: string;
    to: string;
    guardName?: string;
    guardResult?: GuardResult;
    error?: string;
    duration?: number;
};
type RouterListener = (state: RouterState) => void;
type DevToolsCallback = (log: CompassLogEntry) => void;
type TransitionConfig = {
    enter: string;
    exit: string;
    duration?: number;
};
type BlockerState = {
    isBlocked: boolean;
    proceed: () => void;
    cancel: () => void;
    message?: string;
};
type BlockerFn = (location: RouteContext) => boolean | string;
type ScrollPosition = {
    x: number;
    y: number;
};
type PrefetchOptions = {
    type?: 'hover' | 'visible' | 'intent' | 'immediate';
    delay?: number;
};
type QueryStateOptions<T> = {
    defaultValue: T;
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
};
type NavigationEvent = {
    to: RouteContext;
    from: RouteContext | null;
    duration: number;
    blocked: boolean;
    guardResults: GuardResult[];
};
type FocusTarget = 'heading' | 'first-input' | 'main' | string;
type NavigationState = {
    state: 'idle' | 'loading' | 'submitting';
    location?: RouteContext;
    formMethod?: string;
    formAction?: string;
    formData?: FormData;
};
type MiddlewareContext = {
    to: RouteContext;
    from: RouteContext | null;
    params: RouteParams;
    query: QueryParams;
};
type MiddlewareNext = () => void | Promise<void>;
type MiddlewareFn = (context: MiddlewareContext, next: MiddlewareNext) => void | Promise<void>;
type ViewTransitionOptions = {
    enabled?: boolean;
    skipTransition?: boolean;
    types?: string[];
};
type SSRRenderResult = {
    html: string;
    head: {
        title?: string;
        meta: Array<{
            name: string;
            content: string;
        }>;
        links: Array<{
            rel: string;
            href: string;
        }>;
    };
    redirect?: string;
    status: number;
    loaderData: Record<string, unknown>;
};
type SSRContext = {
    url: string;
    routes: CoreRouteConfig[];
    loaderData?: Record<string, unknown>;
};

export type { ActionFn as A, BlockerFn as B, CoreRouteConfig as C, DevToolsCallback as D, FocusTarget as F, Guard as G, LoaderFn as L, MiddlewareFn as M, NavigateOptions as N, PrefetchOptions as P, QueryParams as Q, RouteParams as R, SSRContext as S, TransitionConfig as T, ViewTransitionOptions as V, RouteContext as a, SSRRenderResult as b, CoreRouterConfig as c, GuardFn as d, RouteMeta as e, RevalidationContext as f, GuardResult as g, RouterState as h, RouterListener as i, RouteFn as j, MatchResult as k, ActionContext as l, ActionResult as m, BlockerState as n, BreadcrumbItem as o, CompassLogEntry as p, LoaderContext as q, MiddlewareContext as r, MiddlewareNext as s, NavigationEvent as t, NavigationState as u, QueryStateOptions as v, ScrollPosition as w };
