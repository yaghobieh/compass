import type { ReactNode, ComponentType, LazyExoticComponent } from 'react';

/** Guard result - allow, deny, or redirect */
export type GuardResult = 
  | { allowed: true }
  | { allowed: false; redirect?: string; reason?: string };

/** Guard function signature */
export type GuardFn = (context: RouteContext) => GuardResult | Promise<GuardResult>;

/** Named guard with metadata */
export type Guard = {
  name: string;
  check: GuardFn;
  onDeny?: (result: GuardResult, context: RouteContext) => void;
};

/** Route parameters extracted from path */
export type RouteParams = Record<string, string>;

/** Query string parameters */
export type QueryParams = Record<string, string | string[] | undefined>;

/** Current route context passed to guards and components */
export type RouteContext = {
  path: string;
  params: RouteParams;
  query: QueryParams;
  hash: string;
  state?: unknown;
  meta: RouteMeta;
};

/** Route metadata for SEO, titles, etc. */
export type RouteMeta = {
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
export type RouteComponent = 
  | ComponentType<RouteComponentProps>
  | LazyExoticComponent<ComponentType<RouteComponentProps>>;

/** Props passed to route components */
export type RouteComponentProps = {
  route: RouteContext;
  children?: ReactNode;
};

/** Single route configuration */
export type RouteConfig = {
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
  errorBoundary?: ComponentType<{ error: Error }>;
};

/** Router configuration options */
export type RouterConfig = {
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
export type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
  preserveQuery?: boolean;
  preserveHash?: boolean;
  skipHistoryUpdate?: boolean;
};

/** Router instance */
export type Router = {
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
export type RouterState = {
  currentRoute: RouteContext | null;
  previousRoute: RouteContext | null;
  isNavigating: boolean;
  isLoading: boolean;
  error: Error | null;
  history: RouteContext[];
};

/** Match result from route matching */
export type MatchResult = {
  route: RouteConfig;
  params: RouteParams;
  matched: RouteConfig[];
} | null;

/** Breadcrumb item */
export type BreadcrumbItem = {
  name: string;
  path: string;
  meta?: RouteMeta;
  isActive: boolean;
};

/** Link props */
export type LinkProps = {
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
export type CompassLogEntry = {
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
export type RouterListener = (state: RouterState) => void;

/** DevTools callback type */
export type DevToolsCallback = (log: CompassLogEntry) => void;

/** Route component props for declarative definition */
export type RouteProps = {
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
export type CompassProviderConfig = RouterConfig & {
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
export type TransitionConfig = {
  enter: string;
  exit: string;
  duration?: number;
};

/** Blocker state for navigation blocking */
export type BlockerState = {
  isBlocked: boolean;
  proceed: () => void;
  cancel: () => void;
  message?: string;
};

/** Blocker function */
export type BlockerFn = (location: RouteContext) => boolean | string;

/** Scroll position */
export type ScrollPosition = {
  x: number;
  y: number;
};

/** Prefetch options */
export type PrefetchOptions = {
  type?: 'hover' | 'visible' | 'intent' | 'immediate';
  delay?: number;
};

/** Route group configuration */
export type RouteGroupConfig = {
  guards?: (Guard | GuardFn | string)[];
  layout?: RouteComponent;
  meta?: RouteMeta;
  fallback?: ReactNode;
  errorBoundary?: ComponentType<{ error: Error }>;
  children: RouteConfig[];
};

/** Query state options */
export type QueryStateOptions<T> = {
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
};

/** Route analytics event */
export type NavigationEvent = {
  to: RouteContext;
  from: RouteContext | null;
  duration: number;
  blocked: boolean;
  guardResults: GuardResult[];
};

/** Focus target options */
export type FocusTarget = 'heading' | 'first-input' | 'main' | string;

// ============================================
// Route Loaders & Actions
// ============================================

/** Loader context passed to route loaders */
export type LoaderContext = {
  params: RouteParams;
  query: QueryParams;
  request: Request;
  signal: AbortSignal;
};

/** Loader function signature */
export type LoaderFn<T = unknown> = (context: LoaderContext) => T | Promise<T>;

/** Action context passed to route actions */
export type ActionContext = {
  params: RouteParams;
  request: Request;
  formData: FormData;
};

/** Action function signature */
export type ActionFn<T = unknown> = (context: ActionContext) => T | Promise<T>;

/** Action result */
export type ActionResult<T = unknown> = {
  data?: T;
  error?: Error;
  status: 'idle' | 'submitting' | 'success' | 'error';
};

/** Extended route config with loaders and actions */
export type RouteConfigWithLoader = RouteConfig & {
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
export type RevalidationContext = {
  currentUrl: string;
  nextUrl: string;
  formMethod?: string;
  formAction?: string;
  defaultShouldRevalidate: boolean;
};

// ============================================
// Navigation State
// ============================================

/** Navigation state for pending UI */
export type NavigationState = {
  state: 'idle' | 'loading' | 'submitting';
  location?: RouteContext;
  formMethod?: string;
  formAction?: string;
  formData?: FormData;
};

// ============================================
// Middleware
// ============================================

/** Middleware context */
export type MiddlewareContext = {
  to: RouteContext;
  from: RouteContext | null;
  params: RouteParams;
  query: QueryParams;
};

/** Middleware next function */
export type MiddlewareNext = () => void | Promise<void>;

/** Middleware function */
export type MiddlewareFn = (
  context: MiddlewareContext,
  next: MiddlewareNext
) => void | Promise<void>;

// ============================================
// View Transitions
// ============================================

/** View transition options */
export type ViewTransitionOptions = {
  enabled?: boolean;
  skipTransition?: boolean;
  types?: string[];
};

// ============================================
// Route Search
// ============================================

/** Route search result */
export type RouteSearchResult = {
  route: RouteConfig;
  score: number;
  matches: string[];
};

// ============================================
// SSR Types
// ============================================

/** SSR render result */
export type SSRRenderResult = {
  html: string;
  head: {
    title?: string;
    meta: Array<{ name: string; content: string }>;
    links: Array<{ rel: string; href: string }>;
  };
  redirect?: string;
  status: number;
  loaderData: Record<string, unknown>;
};

/** SSR context */
export type SSRContext = {
  url: string;
  routes: RouteConfig[];
  loaderData?: Record<string, unknown>;
};

// ============================================
// Extended Provider Config
// ============================================

/** Extended compass provider configuration */
export type CompassProviderConfigExtended = CompassProviderConfig & {
  middleware?: MiddlewareFn[];
  viewTransitions?: boolean | ViewTransitionOptions;
  ssr?: boolean;
  ssrContext?: SSRContext;
};

