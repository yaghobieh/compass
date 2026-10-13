import * as react from 'react';
import { ReactNode, AnchorHTMLAttributes, Component, ComponentType } from 'react';
import { C as CompassRouter } from '../Router-BBCgAzWl.mjs';
import { C as CompassProviderConfig, R as RouteConfig, f as RouteProps, g as RouteSearchResult } from '../index-oPSUCVUi.mjs';
import { N as NavigateOptions, R as RouteParams, Q as QueryParams, a as RouteContext, h as RouterState, G as Guard, g as GuardResult, o as BreadcrumbItem, B as BlockerFn, n as BlockerState, P as PrefetchOptions, w as ScrollPosition, F as FocusTarget, T as TransitionConfig, L as LoaderFn, A as ActionFn, m as ActionResult, u as NavigationState, M as MiddlewareFn, r as MiddlewareContext } from '../core-DKMffvjs.mjs';
import * as react_jsx_runtime from 'react/jsx-runtime';

type CompassContextValue = {
    router: CompassRouter<RouteConfig>;
    state: RouterState;
    devToolsEnabled: boolean;
    config: CompassProviderConfig;
};
declare const getCompassContext: () => react.Context<CompassContextValue | null>;
type CompassProviderProps = CompassProviderConfig & {
    children: ReactNode;
};
declare const CompassProvider: ({ children, devTools, devToolsPosition, showProgress, progressColor, scrollRestoration, announceRoutes, announceFormat, transition, transitionDuration, ...config }: CompassProviderProps) => JSX.Element;
declare const useCompassContext: () => CompassContextValue;
declare const useRouter: () => CompassRouter<RouteConfig>;
declare const useRoute: () => RouteContext | null;
declare const useParams: <T extends RouteParams = RouteParams>() => T;
declare const useQuery: <T extends QueryParams = QueryParams>() => T;
declare const useNavigate: () => {
    navigate: (to: string, options?: NavigateOptions) => void;
    push: (to: string, options?: NavigateOptions) => void;
    replace: (to: string, options?: NavigateOptions) => void;
    back: () => void;
    forward: () => void;
    go: (delta: number) => void;
};

type RoutesProps = {
    children?: ReactNode;
    fallback?: ReactNode;
};
declare const Routes: ({ children, fallback }: RoutesProps) => JSX.Element | null;

/**
 * Route component for declarative route definition
 * Note: This is primarily used for configuration, not rendering
 */
declare const Route: (_props: RouteProps) => null;

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    to: string;
    replace?: boolean;
    state?: unknown;
    children?: ReactNode;
    prefetch?: boolean;
};
declare const Link: ({ to, replace, state, children, onClick, prefetch, ...rest }: LinkProps) => JSX.Element;

type NavLinkProps = LinkProps & {
    activeClassName?: string;
    exactActiveClassName?: string;
    exact?: boolean;
};
declare const NavLink: ({ to, className, activeClassName, exactActiveClassName, exact, ...rest }: NavLinkProps) => JSX.Element;

type NavigateProps = {
    to: string;
    replace?: boolean;
    state?: unknown;
};
declare const Navigate: ({ to, replace, state }: NavigateProps) => null;

type OutletProps = {
    fallback?: ReactNode;
};
declare const Outlet: ({ fallback }: OutletProps) => JSX.Element | null;

type UseGuardReturn = {
    isChecking: boolean;
    isAllowed: boolean;
    result: GuardResult | null;
    recheck: () => void;
};
declare const useGuard: (guard: Guard) => UseGuardReturn;

declare const useBreadcrumbs: () => BreadcrumbItem[];

type UseRouteMatchReturn<T extends RouteParams = RouteParams> = {
    matched: boolean;
    params: T;
};
declare const useRouteMatch: <T extends RouteParams = RouteParams>(pattern: string) => UseRouteMatchReturn<T>;

type UseBlockerReturn = {
    state: BlockerState;
    block: (message?: string | BlockerFn) => void;
    unblock: () => void;
    isBlocking: boolean;
};
declare const useBlocker: (shouldBlock?: boolean | BlockerFn, message?: string) => UseBlockerReturn;

type QueryValue = string | number | boolean | null | undefined;
type QueryObject = Record<string, QueryValue | QueryValue[]>;
type UseQueryStateOptions<T extends QueryObject> = {
    defaultValue?: T;
    replace?: boolean;
};
declare const useQueryState: <T extends QueryObject>(options?: UseQueryStateOptions<T>) => [T, (updates: Partial<T>) => void, () => void];
declare const useQueryParam: <T extends QueryValue>(key: string, defaultValue?: T) => [T | undefined, (value: T | undefined) => void];

type UsePrefetchReturn = {
    prefetch: (path: string) => void;
    prefetchOnHover: (path: string) => {
        onMouseEnter: () => void;
        onFocus: () => void;
    };
};
declare const usePrefetch: (options?: PrefetchOptions) => UsePrefetchReturn;
declare const useIntersectionPrefetch: (paths: string[], options?: IntersectionObserverInit) => React.RefObject<HTMLElement>;

type ScrollRestorationMode = 'auto' | 'manual' | 'disabled';
declare const useScrollRestoration: (mode?: ScrollRestorationMode) => {
    savePosition: () => void;
    restorePosition: () => void;
    scrollTo: (position: ScrollPosition) => void;
    scrollToTop: () => void;
};

type UseFocusReturn = {
    setFocus: (target: FocusTarget) => void;
    focusMain: () => void;
    focusHeading: () => void;
    focusFirstInput: () => void;
};
declare const useFocus: (autoFocus?: FocusTarget) => UseFocusReturn;

type ProgressBarProps = {
    color?: string;
    height?: number;
    delay?: number;
    duration?: number;
};
declare const ProgressBar: ({ color, height, delay, duration, }: ProgressBarProps) => JSX.Element | null;

type RouteAnnouncerProps = {
    format?: (route: RouteContext) => string;
    delay?: number;
};
declare const RouteAnnouncer: ({ format, delay, }: RouteAnnouncerProps) => JSX.Element;

type TransitionType = 'fade' | 'slide' | 'none';
type TransitionProps = {
    children: ReactNode;
    type?: TransitionType | TransitionConfig;
    duration?: number;
    className?: string;
};
declare const Transition: ({ children, type, duration, className, }: TransitionProps) => JSX.Element;

type ErrorBoundaryProps = {
    children: ReactNode;
    fallback?: ComponentType<{
        error: Error;
        resetError: () => void;
    }>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
};
type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
};
declare class RouteErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    resetError: () => void;
    render(): ReactNode;
}

type LoaderState<T> = {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    isStale: boolean;
};
type UseLoaderDataOptions = {
    revalidateOnFocus?: boolean;
    revalidateOnReconnect?: boolean;
    staleTime?: number;
};
declare const useLoaderData: <T = unknown>(loader?: LoaderFn<T>, options?: UseLoaderDataOptions) => LoaderState<T> & {
    revalidate: () => void;
};
declare const createLoader: <T>(loader: LoaderFn<T>) => LoaderFn<T>;

type UseActionOptions<T> = {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    redirectTo?: string;
    revalidate?: boolean;
};
type UseActionReturn<T> = ActionResult<T> & {
    submit: (formDataOrEvent?: FormData | React.FormEvent) => Promise<void>;
    reset: () => void;
    isSubmitting: boolean;
};
declare const useAction: <T = unknown>(action?: ActionFn<T>, options?: UseActionOptions<T>) => UseActionReturn<T>;
declare const createAction: <T>(action: ActionFn<T>) => ActionFn<T>;

type UseNavigationReturn = NavigationState & {
    isIdle: boolean;
    isLoading: boolean;
    isSubmitting: boolean;
};
declare const useNavigation: () => UseNavigationReturn;
declare const usePendingLocation: () => RouteContext | null;

type UseViewTransitionOptions = {
    enabled?: boolean;
    types?: string[];
};
type UseViewTransitionReturn = {
    isSupported: boolean;
    isTransitioning: boolean;
    startTransition: (callback: () => void | Promise<void>) => Promise<void>;
};
declare const useViewTransition: (options?: UseViewTransitionOptions) => UseViewTransitionReturn;
declare const ViewTransitionLink: ({ to, children, viewTransitionName, ...props }: {
    to: string;
    children: React.ReactNode;
    viewTransitionName?: string;
    className?: string;
    style?: React.CSSProperties;
}) => react_jsx_runtime.JSX.Element;

declare const registerMiddleware: (middleware: MiddlewareFn) => (() => void);
declare const clearMiddleware: () => void;
declare const runMiddleware: (middleware: MiddlewareFn[], context: MiddlewareContext) => Promise<void>;
declare const useMiddleware: (middleware: MiddlewareFn) => void;
declare const createMiddleware: (_name: string, handler: (context: MiddlewareContext) => void | Promise<void>) => MiddlewareFn;
declare const loggerMiddleware: MiddlewareFn;
declare const analyticsMiddleware: (trackPageView: (path: string, params?: Record<string, string>) => void) => MiddlewareFn;

type UseRouteSearchReturn = {
    searchRoutes: (query: string) => RouteSearchResult[];
    allRoutes: RouteConfig[];
    flatRoutes: RouteConfig[];
};
declare const useRouteSearch: () => UseRouteSearchReturn;
declare const CommandPalette: ({ isOpen, onClose: _onClose, onSelect: _onSelect, }: {
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (route: RouteConfig) => void;
}) => null;

type ParallelRoutesState = {
    slots: Record<string, RouteContext | null>;
};
type ParallelRoutesContextValue = {
    state: ParallelRoutesState;
    openSlot: (slot: string, route: RouteContext) => void;
    closeSlot: (slot: string) => void;
    isSlotOpen: (slot: string) => boolean;
};
declare const ParallelRoutesProvider: ({ children, }: {
    children: ReactNode;
}) => JSX.Element;
declare const useParallelRoutes: () => ParallelRoutesContextValue;
declare const ParallelOutlet: ({ name, fallback, }: {
    name: string;
    fallback?: ReactNode;
}) => JSX.Element | null;
declare const useSlot: (name: string) => {
    route: RouteContext | null;
    isOpen: boolean;
    open: (route: RouteContext) => void;
    close: () => void;
};

type InterceptingRouteProps = {
    pattern: string;
    interceptFrom?: string[];
    modalComponent: ComponentType<{
        route: RouteContext;
        onClose: () => void;
    }>;
    pageComponent: ComponentType<{
        route: RouteContext;
    }>;
    children?: ReactNode;
};
declare const InterceptingRoute: ({ pattern, interceptFrom, modalComponent: ModalComponent, pageComponent: PageComponent, }: InterceptingRouteProps) => JSX.Element | null;
declare const useInterceptedRoute: () => {
    isIntercepted: boolean;
    previousRoute: RouteContext | null;
    currentRoute: RouteContext | null;
};

type ExtractParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}` ? {
    [K in Param | keyof ExtractParams<Rest>]: string;
} : T extends `${string}:${infer Param}` ? {
    [K in Param]: string;
} : Record<string, never>;
declare const useTypedParams: <T extends string>() => ExtractParams<T>;
declare const useTypedQuery: <T extends Record<string, string | number | boolean | undefined>>() => T;
type RouteDefinition<TPath extends string, TParams = ExtractParams<TPath>> = {
    path: TPath;
    params: TParams;
};
declare const defineRoute: <TPath extends string>(path: TPath) => RouteDefinition<TPath>;
declare const buildTypedPath: <TPath extends string>(path: TPath, params: ExtractParams<TPath>) => string;
type TypedRouteConfig<TPath extends string> = {
    path: TPath;
    getPath: (params: ExtractParams<TPath>) => string;
    useParams: () => ExtractParams<TPath>;
};
declare const createTypedRoute: <TPath extends string>(path: TPath) => TypedRouteConfig<TPath>;
declare const routes: {
    readonly home: TypedRouteConfig<"/">;
    readonly user: TypedRouteConfig<"/users/:userId">;
    readonly userPost: TypedRouteConfig<"/users/:userId/posts/:postId">;
    readonly settings: TypedRouteConfig<"/settings/:section">;
};

export { CommandPalette, CompassProvider, InterceptingRoute, Link, NavLink, Navigate, Outlet, ParallelOutlet, ParallelRoutesProvider, ProgressBar, Route, RouteAnnouncer, RouteErrorBoundary, Routes, Transition, ViewTransitionLink, analyticsMiddleware, buildTypedPath, clearMiddleware, createAction, createLoader, createMiddleware, createTypedRoute, defineRoute, getCompassContext, loggerMiddleware, registerMiddleware, runMiddleware, routes as typedRoutes, useAction, useBlocker, useBreadcrumbs, useCompassContext, useFocus, useGuard, useInterceptedRoute, useIntersectionPrefetch, useLoaderData, useMiddleware, useNavigate, useNavigation, useParallelRoutes, useParams, usePendingLocation, usePrefetch, useQuery, useQueryParam, useQueryState, useRoute, useRouteMatch, useRouteSearch, useRouter, useScrollRestoration, useSlot, useTypedParams, useTypedQuery, useViewTransition };
