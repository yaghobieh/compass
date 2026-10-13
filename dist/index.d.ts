export { C as CompassRouter, c as createRouter } from './Router-D264gYl-.js';
import { R as RouteConfig, a as RouteGroupConfig } from './index-BL1otzyT.js';
export { C as CompassProviderConfig, b as CompassProviderConfigExtended, L as LinkProps, c as RouteComponent, d as RouteComponentProps, e as RouteConfigWithLoader, f as RouteProps, g as RouteSearchResult, h as Router, i as RouterConfig } from './index-BL1otzyT.js';
import { Q as QueryParams, C as CoreRouteConfig, R as RouteParams, k as MatchResult, G as Guard, d as GuardFn, e as RouteMeta, a as RouteContext, g as GuardResult } from './core-DKMffvjs.js';
export { l as ActionContext, A as ActionFn, m as ActionResult, B as BlockerFn, n as BlockerState, o as BreadcrumbItem, p as CompassLogEntry, c as CoreRouterConfig, D as DevToolsCallback, F as FocusTarget, q as LoaderContext, L as LoaderFn, r as MiddlewareContext, M as MiddlewareFn, s as MiddlewareNext, N as NavigateOptions, t as NavigationEvent, u as NavigationState, P as PrefetchOptions, v as QueryStateOptions, f as RevalidationContext, j as RouteFn, i as RouterListener, h as RouterState, S as SSRContext, b as SSRRenderResult, w as ScrollPosition, T as TransitionConfig, V as ViewTransitionOptions } from './core-DKMffvjs.js';
export { c as createRoute, g as getComponent, r as registerComponent, a as resolveRouteComponents } from './componentRegistry-BIO702m7.js';
export { CommandPalette, CompassProvider, InterceptingRoute, Link, NavLink, Navigate, Outlet, ParallelOutlet, ParallelRoutesProvider, ProgressBar, Route, RouteAnnouncer, RouteErrorBoundary, Routes, Transition, ViewTransitionLink, analyticsMiddleware, buildTypedPath, clearMiddleware, createAction, createLoader, createMiddleware, createTypedRoute, defineRoute, loggerMiddleware, registerMiddleware, runMiddleware, typedRoutes, useAction, useBlocker, useBreadcrumbs, useFocus, useGuard, useInterceptedRoute, useIntersectionPrefetch, useLoaderData, useMiddleware, useNavigate, useNavigation, useParallelRoutes, useParams, usePendingLocation, usePrefetch, useQuery, useQueryParam, useQueryState, useRoute, useRouteMatch, useRouteSearch, useRouter, useScrollRestoration, useSlot, useTypedParams, useTypedQuery, useViewTransition } from './react/index.js';
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
declare const matchRoute: <T extends CoreRouteConfig>(routes: T[], pathname: string, parentPath?: string) => MatchResult<T>;
declare const joinPaths: (...paths: string[]) => string;
declare const resolvePath: (pattern: string, params?: RouteParams) => string;
declare const flattenRoutes: <T extends CoreRouteConfig>(routes: T[], parentPath?: string) => Array<T & {
    fullPath: string;
}>;
declare const findRouteByName: <T extends CoreRouteConfig>(routes: T[], name: string) => T | null;

declare const routeGroup: (config: RouteGroupConfig) => RouteConfig[];
declare const mergeRouteGroups: (...groups: RouteConfig[][]) => RouteConfig[];
declare const createRedirect: (from: string, to: string, options?: {
    guards?: (Guard | GuardFn | string)[];
    meta?: RouteMeta;
}) => RouteConfig;

type ParsedRouteSpec = {
    name: string;
    fn: string;
    path: string;
    component: string;
};
declare const parseRouteSpec: (spec: string) => ParsedRouteSpec;

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

export { CoreRouteConfig, GUARD_RESULTS, Guard, GuardFn, GuardResult, MatchResult, QueryParams, RouteConfig, RouteContext, RouteGroupConfig, RouteMeta, RouteParams, VERSION, anyGuard, authGuard, buildPath, combineGuards, conditionalGuard, createGuard, createRedirect, featureGuard, findRouteByName, flattenRoutes, joinPaths, matchPath, matchRoute, mergeRouteGroups, notGuard, parsePath, parseRouteSpec, permissionGuard, rateLimitGuard, resolvePath, roleGuard, routeGroup };
