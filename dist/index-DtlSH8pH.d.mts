import { ComponentType, ReactNode, LazyExoticComponent } from 'react';

/** Guard result - allow, deny, or redirect */
type GuardResult = {
    allowed: true;
} | {
    allowed: false;
    redirect?: string;
    reason?: string;
};
/** Guard function signature */
type GuardFn = (context: RouteContext) => GuardResult | Promise<GuardResult>;
/** Named guard with metadata */
type Guard = {
    name: string;
    check: GuardFn;
    onDeny?: (result: GuardResult, context: RouteContext) => void;
};
/** Route parameters extracted from path */
type RouteParams = Record<string, string>;
/** Query string parameters */
type QueryParams = Record<string, string | string[] | undefined>;
/** Current route context passed to guards and components */
type RouteContext = {
    path: string;
    params: RouteParams;
    query: QueryParams;
    hash: string;
    state?: unknown;
    meta: RouteMeta;
};
/** Route metadata for SEO, titles, etc. */
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
/** Route component - can be lazy loaded */
type RouteComponent = ComponentType<RouteComponentProps> | LazyExoticComponent<ComponentType<RouteComponentProps>>;
/** Props passed to route components */
type RouteComponentProps = {
    route: RouteContext;
    children?: ReactNode;
};
/** Single route configuration */
type RouteConfig = {
    path: string;
    name?: string;
    component?: RouteComponent;
    element?: ReactNode;
    children?: RouteConfig[];
    guards?: (Guard | GuardFn | string)[];
    meta?: RouteMeta;
    redirect?: string;
    index?: boolean;
    layout?: RouteComponent;
    fallback?: ReactNode;
    errorBoundary?: ComponentType<{
        error: Error;
    }>;
};
/** Router configuration options */
type RouterConfig = {
    routes?: RouteConfig[];
    basePath?: string;
    mode?: 'history' | 'hash';
    scrollBehavior?: 'top' | 'preserve' | ((to: RouteContext, from: RouteContext | null) => void);
    defaultGuards?: (Guard | GuardFn)[];
    onNavigate?: (to: RouteContext, from: RouteContext | null) => void;
    onGuardDeny?: (result: GuardResult, context: RouteContext) => void;
    notFound?: RouteComponent | ReactNode;
    loading?: ReactNode;
};
/** Navigation options */
type NavigateOptions = {
    replace?: boolean;
    state?: unknown;
    preserveQuery?: boolean;
    preserveHash?: boolean;
};
/** Router instance */
type Router = {
    navigate: (to: string, options?: NavigateOptions) => void;
    push: (to: string, options?: NavigateOptions) => void;
    replace: (to: string, options?: NavigateOptions) => void;
    back: () => void;
    forward: () => void;
    go: (delta: number) => void;
    getCurrentRoute: () => RouteContext | null;
    getRoutes: () => RouteConfig[];
    addRoute: (route: RouteConfig, parentName?: string) => void;
    removeRoute: (name: string) => void;
    hasRoute: (name: string) => boolean;
    resolve: (to: string, params?: RouteParams) => string;
    subscribe: (listener: (route: RouteContext) => void) => () => void;
};
/** Router state */
type RouterState = {
    currentRoute: RouteContext | null;
    previousRoute: RouteContext | null;
    isNavigating: boolean;
    isLoading: boolean;
    error: Error | null;
    history: RouteContext[];
};
/** Match result from route matching */
type MatchResult = {
    route: RouteConfig;
    params: RouteParams;
    matched: RouteConfig[];
} | null;
/** Breadcrumb item */
type BreadcrumbItem = {
    name: string;
    path: string;
    meta?: RouteMeta;
    isActive: boolean;
};
/** Link props */
type LinkProps = {
    to: string;
    replace?: boolean;
    state?: unknown;
    className?: string;
    activeClassName?: string;
    exactActiveClassName?: string;
    children?: ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
    prefetch?: boolean;
};
/** DevTools log entry */
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
/** Router listener type */
type RouterListener = (state: RouterState) => void;
/** DevTools callback type */
type DevToolsCallback = (log: CompassLogEntry) => void;
/** Route component props for declarative definition */
type RouteProps = {
    path: string;
    name?: string;
    component?: RouteComponent;
    element?: ReactNode;
    children?: ReactNode;
    guards?: (Guard | GuardFn | string)[];
    meta?: RouteMeta;
    redirect?: string;
    index?: boolean;
    layout?: RouteComponent;
    fallback?: ReactNode;
};
/** Compass provider configuration */
type CompassProviderConfig = RouterConfig & {
    devTools?: boolean;
    devToolsPosition?: 'left' | 'right';
    showProgress?: boolean;
    progressColor?: string;
    scrollRestoration?: 'auto' | 'manual' | 'disabled';
    announceRoutes?: boolean;
    announceFormat?: (route: RouteContext) => string;
    transition?: 'fade' | 'slide' | 'none' | TransitionConfig;
    transitionDuration?: number;
};
/** Transition configuration */
type TransitionConfig = {
    enter: string;
    exit: string;
    duration?: number;
};
/** Blocker state for navigation blocking */
type BlockerState = {
    isBlocked: boolean;
    proceed: () => void;
    cancel: () => void;
    message?: string;
};
/** Blocker function */
type BlockerFn = (location: RouteContext) => boolean | string;
/** Scroll position */
type ScrollPosition = {
    x: number;
    y: number;
};
/** Prefetch options */
type PrefetchOptions = {
    type?: 'hover' | 'visible' | 'intent' | 'immediate';
    delay?: number;
};
/** Route group configuration */
type RouteGroupConfig = {
    guards?: (Guard | GuardFn | string)[];
    layout?: RouteComponent;
    meta?: RouteMeta;
    fallback?: ReactNode;
    errorBoundary?: ComponentType<{
        error: Error;
    }>;
    children: RouteConfig[];
};
/** Query state options */
type QueryStateOptions<T> = {
    defaultValue: T;
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
};
/** Route analytics event */
type NavigationEvent = {
    to: RouteContext;
    from: RouteContext | null;
    duration: number;
    blocked: boolean;
    guardResults: GuardResult[];
};
/** Focus target options */
type FocusTarget = 'heading' | 'first-input' | 'main' | string;
/** Loader context passed to route loaders */
type LoaderContext = {
    params: RouteParams;
    query: QueryParams;
    request: Request;
    signal: AbortSignal;
};
/** Loader function signature */
type LoaderFn<T = unknown> = (context: LoaderContext) => T | Promise<T>;
/** Action context passed to route actions */
type ActionContext = {
    params: RouteParams;
    request: Request;
    formData: FormData;
};
/** Action function signature */
type ActionFn<T = unknown> = (context: ActionContext) => T | Promise<T>;
/** Action result */
type ActionResult<T = unknown> = {
    data?: T;
    error?: Error;
    status: 'idle' | 'submitting' | 'success' | 'error';
};
/** Extended route config with loaders and actions */
type RouteConfigWithLoader = RouteConfig & {
    loader?: LoaderFn;
    action?: ActionFn;
    shouldRevalidate?: (context: RevalidationContext) => boolean;
    viewTransitionName?: string;
    parallel?: boolean;
    slot?: string;
    intercept?: {
        component: RouteComponent;
        from?: string[];
    };
};
/** Revalidation context */
type RevalidationContext = {
    currentUrl: string;
    nextUrl: string;
    formMethod?: string;
    formAction?: string;
    defaultShouldRevalidate: boolean;
};
/** Navigation state for pending UI */
type NavigationState = {
    state: 'idle' | 'loading' | 'submitting';
    location?: RouteContext;
    formMethod?: string;
    formAction?: string;
    formData?: FormData;
};
/** Middleware context */
type MiddlewareContext = {
    to: RouteContext;
    from: RouteContext | null;
    params: RouteParams;
    query: QueryParams;
};
/** Middleware next function */
type MiddlewareNext = () => void | Promise<void>;
/** Middleware function */
type MiddlewareFn = (context: MiddlewareContext, next: MiddlewareNext) => void | Promise<void>;
/** View transition options */
type ViewTransitionOptions = {
    enabled?: boolean;
    skipTransition?: boolean;
    types?: string[];
};
/** Route search result */
type RouteSearchResult = {
    route: RouteConfig;
    score: number;
    matches: string[];
};
/** SSR render result */
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
/** SSR context */
type SSRContext = {
    url: string;
    routes: RouteConfig[];
    loaderData?: Record<string, unknown>;
};
/** Extended compass provider configuration */
type CompassProviderConfigExtended = CompassProviderConfig & {
    middleware?: MiddlewareFn[];
    viewTransitions?: boolean | ViewTransitionOptions;
    ssr?: boolean;
    ssrContext?: SSRContext;
};

export type { ActionContext as A, BlockerFn as B, CompassLogEntry as C, DevToolsCallback as D, RouteSearchResult as E, FocusTarget as F, Guard as G, Router as H, RouterConfig as I, RouterListener as J, RouterState as K, LinkProps as L, MatchResult as M, NavigateOptions as N, ScrollPosition as O, PrefetchOptions as P, QueryParams as Q, RouteConfig as R, SSRContext as S, TransitionConfig as T, ViewTransitionOptions as V, RouteParams as a, RouteContext as b, SSRRenderResult as c, GuardFn as d, RouteMeta as e, RouteComponent as f, RouteGroupConfig as g, GuardResult as h, ActionFn as i, ActionResult as j, BlockerState as k, BreadcrumbItem as l, CompassProviderConfig as m, CompassProviderConfigExtended as n, LoaderContext as o, LoaderFn as p, MiddlewareContext as q, MiddlewareFn as r, MiddlewareNext as s, NavigationEvent as t, NavigationState as u, QueryStateOptions as v, RevalidationContext as w, RouteComponentProps as x, RouteConfigWithLoader as y, RouteProps as z };
