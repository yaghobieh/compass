export { C as CommandPalette, a as CompassProvider, b as CompassRouter, I as InterceptingRoute, L as Link, N as NavLink, c as Navigate, O as Outlet, P as ParallelOutlet, d as ParallelRoutesProvider, e as ProgressBar, R as Route, f as RouteAnnouncer, g as RouteErrorBoundary, h as Routes, T as Transition, V as ViewTransitionLink, i as analyticsMiddleware, j as buildTypedPath, k as clearMiddleware, l as createAction, m as createLoader, n as createMiddleware, o as createRouter, p as createTypedRoute, q as defineRoute, r as loggerMiddleware, s as registerMiddleware, t as runMiddleware, u as typedRoutes, v as useAction, w as useBlocker, x as useBreadcrumbs, y as useFocus, z as useGuard, A as useInterceptedRoute, B as useIntersectionPrefetch, D as useLoaderData, E as useMiddleware, F as useNavigate, G as useNavigation, H as useParallelRoutes, J as useParams, K as usePendingLocation, M as usePrefetch, Q as useQuery, S as useQueryParam, U as useQueryState, W as useRoute, X as useRouteMatch, Y as useRouteSearch, Z as useRouter, _ as useScrollRestoration, $ as useSlot, a0 as useTypedParams, a1 as useTypedQuery, a2 as useViewTransition } from './index-wIojFfyi.js';
import { Q as QueryParams, R as RouteConfig, a as RouteParams, M as MatchResult, G as Guard, d as GuardFn, e as RouteMeta, f as RouteComponent, g as RouteGroupConfig, b as RouteContext, h as GuardResult } from './index-DtlSH8pH.js';
export { A as ActionContext, i as ActionFn, j as ActionResult, B as BlockerFn, k as BlockerState, l as BreadcrumbItem, C as CompassLogEntry, m as CompassProviderConfig, n as CompassProviderConfigExtended, D as DevToolsCallback, F as FocusTarget, L as LinkProps, o as LoaderContext, p as LoaderFn, q as MiddlewareContext, r as MiddlewareFn, s as MiddlewareNext, N as NavigateOptions, t as NavigationEvent, u as NavigationState, P as PrefetchOptions, v as QueryStateOptions, w as RevalidationContext, x as RouteComponentProps, y as RouteConfigWithLoader, z as RouteProps, E as RouteSearchResult, H as Router, I as RouterConfig, J as RouterListener, K as RouterState, S as SSRContext, c as SSRRenderResult, O as ScrollPosition, T as TransitionConfig, V as ViewTransitionOptions } from './index-DtlSH8pH.js';
import 'react';
import 'react/jsx-runtime';

declare const VERSION: string;
declare const GUARD_RESULTS: {
    readonly ALLOW: {
        readonly allowed: true;
    };
    readonly DENY: {
        readonly allowed: false;
    };
};

declare const parsePath: (path: string) => {
    pathname: string;
    query: QueryParams;
    hash: string;
};
declare const buildPath: (pathname: string, query?: QueryParams, hash?: string) => string;
declare const matchPath: (pattern: string, pathname: string) => {
    matched: boolean;
    params: RouteParams;
};
declare const matchRoute: (routes: RouteConfig[], pathname: string, parentPath?: string) => MatchResult;
declare const joinPaths: (...paths: string[]) => string;
declare const resolvePath: (pattern: string, params?: RouteParams) => string;
declare const flattenRoutes: (routes: RouteConfig[], parentPath?: string) => Array<RouteConfig & {
    fullPath: string;
}>;
declare const findRouteByName: (routes: RouteConfig[], name: string) => RouteConfig | null;

declare const routeGroup: (config: RouteGroupConfig) => RouteConfig[];
declare const mergeRouteGroups: (...groups: RouteConfig[][]) => RouteConfig[];
declare const createRoute: (path: string, component: RouteComponent, options?: Partial<Omit<RouteConfig, "path" | "component">>) => RouteConfig;
declare const createRedirect: (from: string, to: string, options?: {
    guards?: (Guard | GuardFn | string)[];
    meta?: RouteMeta;
}) => RouteConfig;

/**
 * Create a named guard with optional deny handler
 */
declare const createGuard: (name: string, check: GuardFn, onDeny?: (result: GuardResult, context: RouteContext) => void) => Guard;
/**
 * Built-in guard: Check if user is authenticated
 */
declare const authGuard: (isAuthenticated: () => boolean, redirectTo?: string) => Guard;
/**
 * Built-in guard: Check if user has specific role
 */
declare const roleGuard: (allowedRoles: string[], getCurrentRole: () => string | null, redirectTo?: string) => Guard;
/**
 * Built-in guard: Check if user has specific permission
 */
declare const permissionGuard: (requiredPermissions: string[], getUserPermissions: () => string[], redirectTo?: string) => Guard;
/**
 * Built-in guard: Check custom condition
 */
declare const conditionalGuard: (name: string, condition: (context: RouteContext) => boolean, redirectTo?: string, reason?: string) => Guard;
/**
 * Built-in guard: Check if feature flag is enabled
 */
declare const featureGuard: (featureName: string, isFeatureEnabled: (name: string) => boolean, redirectTo?: string) => Guard;
/**
 * Built-in guard: Rate limiting
 */
declare const rateLimitGuard: (maxAttempts: number, windowMs: number, keyFn?: (context: RouteContext) => string) => Guard;
/**
 * Combine multiple guards with AND logic
 */
declare const combineGuards: (guards: Guard[], name?: string) => Guard;
/**
 * Create a guard that passes if ANY guard passes (OR logic)
 */
declare const anyGuard: (guards: Guard[], name?: string) => Guard;
/**
 * Negate a guard result
 */
declare const notGuard: (guard: Guard, name?: string) => Guard;

export { GUARD_RESULTS, Guard, GuardFn, GuardResult, MatchResult, QueryParams, RouteComponent, RouteConfig, RouteContext, RouteGroupConfig, RouteMeta, RouteParams, VERSION, anyGuard, authGuard, buildPath, combineGuards, conditionalGuard, createGuard, createRedirect, createRoute, featureGuard, findRouteByName, flattenRoutes, joinPaths, matchPath, matchRoute, mergeRouteGroups, notGuard, parsePath, permissionGuard, rateLimitGuard, resolvePath, roleGuard, routeGroup };
