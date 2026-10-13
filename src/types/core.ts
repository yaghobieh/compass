/** Framework-agnostic route types. Component values are unknown so Vue, Angular, and Svelte do not import React. */

export type GuardResult =
  | { allowed: true }
  | { allowed: false; redirect?: string; reason?: string };

export type GuardFn = (context: RouteContext) => GuardResult | Promise<GuardResult>;

export type Guard = {
  name: string;
  check: GuardFn;
  onDeny?: (result: GuardResult, context: RouteContext) => void;
};

export type RouteParams = Record<string, string>;

export type QueryParams = Record<string, string | string[] | undefined>;

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

export type RouteContext = {
  path: string;
  params: RouteParams;
  query: QueryParams;
  hash: string;
  state?: unknown;
  meta: RouteMeta;
};

export type LoaderContext = {
  params: RouteParams;
  query: QueryParams;
  request: Request;
  signal: AbortSignal;
};

export type LoaderFn<T = unknown> = (context: LoaderContext) => T | Promise<T>;

export type ActionContext = {
  params: RouteParams;
  request: Request;
  formData: FormData;
};

export type ActionFn<T = unknown> = (context: ActionContext) => T | Promise<T>;

export type ActionResult<T = unknown> = {
  data?: T;
  error?: Error;
  status: 'idle' | 'submitting' | 'success' | 'error';
};

export type RevalidationContext = {
  currentUrl: string;
  nextUrl: string;
  formMethod?: string;
  formAction?: string;
  defaultShouldRevalidate: boolean;
};

/** Guard or loader name, or a guard function. String form of createRoute always stores a name. */
export type RouteFn = string | GuardFn;

export type CoreRouteConfig = {
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

export type CoreRouterConfig<TRoute extends CoreRouteConfig = CoreRouteConfig> = {
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

export type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
  preserveQuery?: boolean;
  preserveHash?: boolean;
  skipHistoryUpdate?: boolean;
};

export type RouterState = {
  currentRoute: RouteContext | null;
  previousRoute: RouteContext | null;
  isNavigating: boolean;
  isLoading: boolean;
  error: Error | null;
  history: RouteContext[];
};

export type MatchResult<TRoute extends CoreRouteConfig = CoreRouteConfig> = {
  route: TRoute;
  params: RouteParams;
  matched: TRoute[];
} | null;

export type BreadcrumbItem = {
  name: string;
  path: string;
  meta?: RouteMeta;
  isActive: boolean;
};

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

export type RouterListener = (state: RouterState) => void;

export type DevToolsCallback = (log: CompassLogEntry) => void;

export type TransitionConfig = {
  enter: string;
  exit: string;
  duration?: number;
};

export type BlockerState = {
  isBlocked: boolean;
  proceed: () => void;
  cancel: () => void;
  message?: string;
};

export type BlockerFn = (location: RouteContext) => boolean | string;

export type ScrollPosition = {
  x: number;
  y: number;
};

export type PrefetchOptions = {
  type?: 'hover' | 'visible' | 'intent' | 'immediate';
  delay?: number;
};

export type QueryStateOptions<T> = {
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
};

export type NavigationEvent = {
  to: RouteContext;
  from: RouteContext | null;
  duration: number;
  blocked: boolean;
  guardResults: GuardResult[];
};

export type FocusTarget = 'heading' | 'first-input' | 'main' | string;

export type NavigationState = {
  state: 'idle' | 'loading' | 'submitting';
  location?: RouteContext;
  formMethod?: string;
  formAction?: string;
  formData?: FormData;
};

export type MiddlewareContext = {
  to: RouteContext;
  from: RouteContext | null;
  params: RouteParams;
  query: QueryParams;
};

export type MiddlewareNext = () => void | Promise<void>;

export type MiddlewareFn = (
  context: MiddlewareContext,
  next: MiddlewareNext
) => void | Promise<void>;

export type ViewTransitionOptions = {
  enabled?: boolean;
  skipTransition?: boolean;
  types?: string[];
};

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

export type SSRContext = {
  url: string;
  routes: CoreRouteConfig[];
  loaderData?: Record<string, unknown>;
};
