import type { ReactNode, ComponentType, LazyExoticComponent } from 'react';
import type {
  ActionFn,
  CoreRouteConfig,
  CoreRouterConfig,
  Guard,
  GuardFn,
  LoaderFn,
  MiddlewareFn,
  NavigateOptions,
  RevalidationContext,
  RouteContext,
  RouteMeta,
  RouteParams,
  SSRContext,
  TransitionConfig,
  ViewTransitionOptions,
} from './core';

export * from './core';

/** Route component - can be lazy loaded */
export type RouteComponent =
  | ComponentType<RouteComponentProps>
  | LazyExoticComponent<ComponentType<RouteComponentProps>>;

/** Props passed to route components */
export type RouteComponentProps = {
  route: RouteContext;
  children?: ReactNode;
};

/**
 * React route configuration.
 * `component` may be a React component or a registry name.
 */
export interface RouteConfig extends CoreRouteConfig {
  component?: RouteComponent | string;
  element?: ReactNode;
  children?: RouteConfig[];
  layout?: RouteComponent | string;
  fallback?: ReactNode;
  errorBoundary?: ComponentType<{ error: Error }>;
}

/** Router configuration options */
export type RouterConfig = Omit<CoreRouterConfig<RouteConfig>, 'notFound' | 'loading'> & {
  notFound?: RouteComponent | ReactNode;
  loading?: ReactNode;
};

/** Router instance */
export type Router<TRoute extends CoreRouteConfig = RouteConfig> = {
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

/** Route component props for declarative definition */
export type RouteProps = {
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

/** Route group configuration */
export type RouteGroupConfig = {
  guards?: (Guard | GuardFn | string)[];
  layout?: RouteComponent | string;
  meta?: RouteMeta;
  fallback?: ReactNode;
  errorBoundary?: ComponentType<{ error: Error }>;
  children: RouteConfig[];
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
    component: RouteComponent | string;
    from?: string[];
  };
};

/** Route search result */
export type RouteSearchResult = {
  route: RouteConfig;
  score: number;
  matches: string[];
};

/** Extended compass provider configuration */
export type CompassProviderConfigExtended = CompassProviderConfig & {
  middleware?: MiddlewareFn[];
  viewTransitions?: boolean | ViewTransitionOptions;
  ssr?: boolean;
  ssrContext?: SSRContext;
};
