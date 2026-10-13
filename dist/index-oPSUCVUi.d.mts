import { ComponentType, ReactNode, LazyExoticComponent } from 'react';
import { C as CoreRouteConfig, a as RouteContext, c as CoreRouterConfig, T as TransitionConfig, M as MiddlewareFn, V as ViewTransitionOptions, S as SSRContext, G as Guard, d as GuardFn, e as RouteMeta, L as LoaderFn, A as ActionFn, f as RevalidationContext, N as NavigateOptions, R as RouteParams } from './core-DKMffvjs.mjs';

/** Route component - can be lazy loaded */
type RouteComponent = ComponentType<RouteComponentProps> | LazyExoticComponent<ComponentType<RouteComponentProps>>;
/** Props passed to route components */
type RouteComponentProps = {
    route: RouteContext;
    children?: ReactNode;
};
/**
 * React route configuration.
 * `component` may be a React component or a registry name.
 */
interface RouteConfig extends CoreRouteConfig {
    component?: RouteComponent | string;
    element?: ReactNode;
    children?: RouteConfig[];
    layout?: RouteComponent | string;
    fallback?: ReactNode;
    errorBoundary?: ComponentType<{
        error: Error;
    }>;
}
/** Router configuration options */
type RouterConfig = Omit<CoreRouterConfig<RouteConfig>, 'notFound' | 'loading'> & {
    notFound?: RouteComponent | ReactNode;
    loading?: ReactNode;
};
/** Router instance */
type Router<TRoute extends CoreRouteConfig = RouteConfig> = {
    navigate: (to: string, options?: NavigateOptions) => void;
    push: (to: string, options?: NavigateOptions) => void;
    replace: (to: string, options?: NavigateOptions) => void;
    back: () => void;
    forward: () => void;
    go: (delta: number) => void;
    getCurrentRoute: () => RouteContext | null;
    getRoutes: () => TRoute[];
    addRoute: (route: TRoute, parentName?: string) => void;
    removeRoute: (name: string) => void;
    hasRoute: (name: string) => boolean;
    resolve: (to: string, params?: RouteParams) => string;
    subscribe: (listener: (route: RouteContext) => void) => () => void;
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
/** Route component props for declarative definition */
type RouteProps = {
    path: string;
    name?: string;
    component?: RouteComponent | string;
    element?: ReactNode;
    children?: ReactNode;
    guards?: (Guard | GuardFn | string)[];
    meta?: RouteMeta;
    redirect?: string;
    index?: boolean;
    layout?: RouteComponent | string;
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
/** Route group configuration */
type RouteGroupConfig = {
    guards?: (Guard | GuardFn | string)[];
    layout?: RouteComponent | string;
    meta?: RouteMeta;
    fallback?: ReactNode;
    errorBoundary?: ComponentType<{
        error: Error;
    }>;
    children: RouteConfig[];
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
        component: RouteComponent | string;
        from?: string[];
    };
};
/** Route search result */
type RouteSearchResult = {
    route: RouteConfig;
    score: number;
    matches: string[];
};
/** Extended compass provider configuration */
type CompassProviderConfigExtended = CompassProviderConfig & {
    middleware?: MiddlewareFn[];
    viewTransitions?: boolean | ViewTransitionOptions;
    ssr?: boolean;
    ssrContext?: SSRContext;
};

export type { CompassProviderConfig as C, LinkProps as L, RouteConfig as R, RouteGroupConfig as a, CompassProviderConfigExtended as b, RouteComponent as c, RouteComponentProps as d, RouteConfigWithLoader as e, RouteProps as f, RouteSearchResult as g, Router as h, RouterConfig as i };
