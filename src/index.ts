// Core
export { CompassRouter, createRouter } from './core';

// Types
export * from './types';

// Constants
export { VERSION, GUARD_RESULTS } from './constants';

// Utils
export {
  parsePath,
  buildPath,
  matchPath,
  matchRoute,
  resolvePath,
  joinPaths,
  flattenRoutes,
  findRouteByName,
} from './utils';

export { routeGroup, mergeRouteGroups, createRedirect } from './utils/routeGroup';
export { createRoute } from './utils/createRoute';
export { registerComponent, getComponent, resolveRouteComponents } from './utils/componentRegistry';
export { parseRouteSpec } from './utils/routeSpec';

// Guards
export {
  createGuard,
  authGuard,
  roleGuard,
  permissionGuard,
  conditionalGuard,
  featureGuard,
  rateLimitGuard,
  combineGuards,
  anyGuard,
  notGuard,
} from './guards';

// React adapter - Core
export {
  CompassProvider,
  useRouter,
  useRoute,
  useParams,
  useQuery,
  useNavigate,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  Outlet,
  useGuard,
  useBreadcrumbs,
  useRouteMatch,
} from './adapters/react';

// React adapter - Advanced features
export {
  useBlocker,
  useQueryState,
  useQueryParam,
  usePrefetch,
  useIntersectionPrefetch,
  useScrollRestoration,
  useFocus,
  ProgressBar,
  RouteAnnouncer,
  Transition,
  RouteErrorBoundary,
} from './adapters/react';

// React adapter - Loaders & Actions
export {
  useLoaderData,
  createLoader,
  useAction,
  createAction,
} from './adapters/react';

// React adapter - Navigation State
export {
  useNavigation,
  usePendingLocation,
} from './adapters/react';

// React adapter - View Transitions
export {
  useViewTransition,
  ViewTransitionLink,
} from './adapters/react';

// React adapter - Middleware
export {
  useMiddleware,
  registerMiddleware,
  clearMiddleware,
  runMiddleware,
  createMiddleware,
  loggerMiddleware,
  analyticsMiddleware,
} from './adapters/react';

// React adapter - Route Search
export {
  useRouteSearch,
  CommandPalette,
} from './adapters/react';

// React adapter - Parallel Routes
export {
  ParallelRoutesProvider,
  useParallelRoutes,
  ParallelOutlet,
  useSlot,
} from './adapters/react';

// React adapter - Intercepting Routes
export {
  InterceptingRoute,
  useInterceptedRoute,
} from './adapters/react';

// React adapter - Typed Params
export {
  useTypedParams,
  useTypedQuery,
  defineRoute,
  buildTypedPath,
  createTypedRoute,
  typedRoutes,
} from './adapters/react';

