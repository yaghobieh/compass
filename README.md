# 🧭 Forge Compass

Type-safe routing with guards, loaders, actions, middleware, and SSR support.

[![npm version](https://img.shields.io/npm/v/@forgedevstack/forge-compass.svg)](https://www.npmjs.com/package/@forgedevstack/forge-compass)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@forgedevstack/forge-compass)](https://bundlephobia.com/package/@forgedevstack/forge-compass)

## Features

- 🛡️ **Guards & Permissions** - Route-level access control with async support
- 📝 **Array-based Config** - Define routes with simple objects
- 🔒 **Type-safe** - Full TypeScript support with inferred params
- ⚡ **Lazy Loading** - Built-in code splitting support
- 🧩 **Nested Routes** - Layouts, outlets, and nested guards
- 🔧 **DevTools** - Real-time navigation debugging
- 📦 **Route Loaders** - Data fetching with caching and revalidation
- 📤 **Route Actions** - Form submissions with optimistic updates
- 🔄 **Pending UI** - Loading states and navigation progress
- ✨ **View Transitions** - Native browser View Transitions API
- 🔗 **Middleware** - Pluggable request pipeline
- 🪟 **Parallel Routes** - Multiple concurrent views
- 🔍 **Route Search** - Fuzzy search and command palette
- 🖥️ **SSR Support** - Server-side rendering utilities

## Installation

```bash
npm install @forgedevstack/forge-compass
```

## Quick Start

### Array-based Routes (Recommended)

```tsx
import { CompassProvider, Routes } from '@forgedevstack/forge-compass/react';
import { authGuard, roleGuard } from '@forgedevstack/forge-compass';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardLayout,
    guards: [authGuard(() => isLoggedIn(), '/login')],
    children: [
      { path: '', component: DashboardHome, index: true },
      { path: 'profile', component: Profile },
      { 
        path: 'admin',
        component: AdminPanel,
        guards: [roleGuard(['admin'], () => userRole, '/unauthorized')],
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '*',
    component: NotFound,
  },
];

function App() {
  return (
    <CompassProvider routes={routes}>
      <Routes />
    </CompassProvider>
  );
}
```

### Using Hooks

```tsx
import { useNavigate, useParams, useRoute } from '@forgedevstack/forge-compass/react';

function UserProfile() {
  const { navigate, back } = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const route = useRoute();

  return (
    <div>
      <h1>User: {userId}</h1>
      <button onClick={() => navigate('/dashboard')}>Dashboard</button>
      <button onClick={back}>Go Back</button>
    </div>
  );
}
```

## Guards

### Built-in Guards

```tsx
import {
  authGuard,
  roleGuard,
  permissionGuard,
  featureGuard,
  conditionalGuard,
} from '@forgedevstack/forge-compass';

// Authentication guard
const isAuthenticated = authGuard(
  () => !!localStorage.getItem('token'),
  '/login'
);

// Role-based guard
const isAdmin = roleGuard(
  ['admin', 'superadmin'],
  () => user.role,
  '/unauthorized'
);

// Permission guard
const canEdit = permissionGuard(
  ['posts:write', 'posts:delete'],
  () => user.permissions,
  '/forbidden'
);

// Feature flag guard
const hasBetaFeature = featureGuard(
  'new-dashboard',
  (name) => features.isEnabled(name)
);

// Custom condition
const isVerified = conditionalGuard(
  'verified',
  (ctx) => user.emailVerified,
  '/verify-email'
);
```

### Custom Guards

```tsx
import { createGuard } from '@forgedevstack/forge-compass';

const subscriptionGuard = createGuard(
  'subscription',
  async (context) => {
    const user = await fetchUser();
    
    if (user.subscription === 'premium') {
      return { allowed: true };
    }
    
    return {
      allowed: false,
      redirect: '/upgrade',
      reason: 'Premium subscription required',
    };
  },
  (result, context) => {
    // Optional: Handle denial
    showToast(result.reason);
  }
);
```

### Combining Guards

```tsx
import { combineGuards, anyGuard, notGuard } from '@forgedevstack/forge-compass';

// All must pass (AND)
const adminAccess = combineGuards([isAuthenticated, isAdmin]);

// Any can pass (OR)
const moderatorOrAdmin = anyGuard([isAdmin, isModerator]);

// Negate
const notLoggedIn = notGuard(isAuthenticated);
```

## Navigation

### Link Component

```tsx
import { Link, NavLink } from '@forgedevstack/forge-compass/react';

<Link to="/dashboard">Dashboard</Link>

<NavLink 
  to="/profile" 
  activeClassName="active"
  exactActiveClassName="exact"
>
  Profile
</NavLink>
```

### Programmatic Navigation

```tsx
const { navigate, push, replace, back, forward } = useNavigate();

// Navigate (default: push)
navigate('/users/123');

// With options
navigate('/dashboard', { 
  replace: true,
  state: { from: 'login' }
});

// Named methods
push('/new-page');
replace('/redirect-target');
back();
forward();
```

## Route Configuration

```tsx
type RouteConfig = {
  path: string;
  name?: string;
  component?: Component;
  element?: ReactNode;
  children?: RouteConfig[];
  guards?: Guard[];
  meta?: {
    title?: string;
    description?: string;
    [key: string]: any;
  };
  redirect?: string;
  index?: boolean;
  layout?: Component;
  fallback?: ReactNode;
};
```

## DevTools

Enable DevTools directly in the provider:

```tsx
function App() {
  return (
    <CompassProvider 
      routes={routes} 
      devTools 
      devToolsPosition="right"
    >
      <Routes />
    </CompassProvider>
  );
}
```

Or import separately for more control:

```tsx
import { CompassDevTools } from '@forgedevstack/forge-compass/devtools';

function App() {
  return (
    <CompassProvider routes={routes}>
      <Routes />
      {process.env.NODE_ENV === 'development' && <CompassDevTools />}
    </CompassProvider>
  );
}
```

## Advanced Features

### Navigation Blocking (Unsaved Changes)

```tsx
import { useBlocker } from '@forgedevstack/forge-compass';

function EditForm() {
  const { block, unblock, state } = useBlocker();
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isDirty) {
      block('You have unsaved changes. Leave anyway?');
    } else {
      unblock();
    }
  }, [isDirty]);

  return (
    <>
      <form>{/* ... */}</form>
      {state.isBlocked && (
        <Modal>
          <p>{state.message}</p>
          <button onClick={state.proceed}>Leave</button>
          <button onClick={state.cancel}>Stay</button>
        </Modal>
      )}
    </>
  );
}
```

### Query String State

```tsx
import { useQueryState, useQueryParam } from '@forgedevstack/forge-compass';

// Full object sync
const [filters, setFilters] = useQueryState({
  defaultValue: { page: 1, search: '', sort: 'date' }
});
// URL: /products?page=1&search=test&sort=date

// Single param
const [page, setPage] = useQueryParam('page', 1);
```

### Route Prefetching

```tsx
import { usePrefetch, Link } from '@forgedevstack/forge-compass';

function Nav() {
  const { prefetch, prefetchOnHover } = usePrefetch();

  return (
    <Link to="/heavy-page" {...prefetchOnHover('/heavy-page')}>
      Heavy Page
    </Link>
  );
}
```

### Loading Progress Bar

```tsx
<CompassProvider routes={routes} showProgress progressColor="#3b82f6">
  <Routes />
</CompassProvider>
```

### Route Transitions

```tsx
import { Transition } from '@forgedevstack/forge-compass';

<Transition type="fade" duration={200}>
  <Routes />
</Transition>

// Custom transition
<Transition 
  type={{
    enter: 'opacity: 0; transform: scale(0.95);',
    exit: 'opacity: 1; transform: scale(1);'
  }}
>
  <Routes />
</Transition>
```

### Scroll Restoration

```tsx
import { useScrollRestoration } from '@forgedevstack/forge-compass';

function App() {
  useScrollRestoration('auto'); // 'auto' | 'manual' | 'disabled'
  return <Routes />;
}
```

### Route Announcer (Accessibility)

```tsx
<CompassProvider 
  routes={routes} 
  announceRoutes
  announceFormat={(route) => `Now viewing ${route.meta.title}`}
>
  <Routes />
</CompassProvider>
```

### Focus Management

```tsx
import { useFocus } from '@forgedevstack/forge-compass';

function Page() {
  const { focusHeading, focusFirstInput } = useFocus('heading');
  // Auto-focuses heading on route change
}
```

### Route Groups

```tsx
import { routeGroup } from '@forgedevstack/forge-compass';

const routes = [
  ...routeGroup({
    guards: [authGuard],
    layout: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '/dashboard', component: Dashboard },
      { path: '/settings', component: Settings },
      { path: '/profile', component: Profile },
    ],
  }),
];
```

### Error Boundaries

```tsx
import { RouteErrorBoundary } from '@forgedevstack/forge-compass';

<RouteErrorBoundary 
  fallback={({ error, resetError }) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={resetError}>Try Again</button>
    </div>
  )}
>
  <Routes />
</RouteErrorBoundary>
```

## Route Loaders

Load data for routes with built-in caching and revalidation:

```tsx
import { useLoaderData, createLoader } from '@forgedevstack/forge-compass';

// Define a loader
const userLoader = createLoader(async ({ params }) => {
  const response = await fetch(`/api/users/${params.id}`);
  return response.json();
});

// Use in routes
const routes = [
  {
    path: '/users/:id',
    component: UserProfile,
    loader: userLoader,
  },
];

// In component
function UserProfile() {
  const { data, isLoading, error, revalidate } = useLoaderData<User>(userLoader, {
    revalidateOnFocus: true,
    staleTime: 5000,
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error error={error} />;
  
  return <Profile user={data} />;
}
```

## Route Actions

Handle form submissions with full state management:

```tsx
import { useAction, createAction } from '@forgedevstack/forge-compass';

const createPostAction = createAction(async ({ formData }) => {
  const response = await fetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  return response.json();
});

function CreatePost() {
  const { submit, isSubmitting, error, data, status } = useAction(createPostAction, {
    onSuccess: (data) => console.log('Created:', data),
    redirectTo: '/posts',
  });

  return (
    <form onSubmit={submit}>
      <input name="title" />
      <textarea name="content" />
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

## Pending UI

Show loading states during navigation:

```tsx
import { useNavigation, usePendingLocation } from '@forgedevstack/forge-compass';

function Layout({ children }) {
  const { isLoading, isIdle, isSubmitting } = useNavigation();
  const pendingLocation = usePendingLocation();

  return (
    <div className={isLoading ? 'opacity-50' : ''}>
      {isLoading && <LoadingBar />}
      {pendingLocation && <p>Navigating to {pendingLocation.path}...</p>}
      {children}
    </div>
  );
}
```

## View Transitions

Use native browser View Transitions API:

```tsx
import { useViewTransition, ViewTransitionLink } from '@forgedevstack/forge-compass';

// Hook usage
function Gallery() {
  const { startTransition, isSupported } = useViewTransition();

  const handleClick = (id: string) => {
    startTransition(() => navigate(`/photos/${id}`));
  };
}

// Component usage
<ViewTransitionLink 
  to="/photos/123" 
  viewTransitionName="photo-123"
>
  <img src="..." />
</ViewTransitionLink>
```

## Middleware

Add pluggable request pipeline:

```tsx
import { 
  createMiddleware, 
  registerMiddleware, 
  loggerMiddleware,
  analyticsMiddleware 
} from '@forgedevstack/forge-compass';

// Built-in logger
registerMiddleware(loggerMiddleware);

// Analytics tracking
registerMiddleware(analyticsMiddleware((path) => {
  gtag('event', 'page_view', { page_path: path });
}));

// Custom middleware
const authMiddleware = createMiddleware('auth', async (context) => {
  if (!isAuthenticated() && context.to.meta?.requiresAuth) {
    navigate('/login');
  }
});
registerMiddleware(authMiddleware);
```

## Parallel Routes

Show multiple views simultaneously (modals, sidebars):

```tsx
import { 
  ParallelRoutesProvider, 
  ParallelOutlet, 
  useSlot 
} from '@forgedevstack/forge-compass';

function App() {
  return (
    <ParallelRoutesProvider>
      <Routes />
      <ParallelOutlet name="modal" fallback={null} />
    </ParallelRoutesProvider>
  );
}

// Open modal while keeping current page
function Gallery() {
  const { open } = useSlot('modal');
  
  const handlePhotoClick = (id: string) => {
    open({ path: `/photos/${id}`, params: { id } });
  };
}
```

## Intercepting Routes

Modal pattern - link opens modal, direct URL opens page:

```tsx
import { InterceptingRoute } from '@forgedevstack/forge-compass';

<InterceptingRoute
  pattern="/photos/:id"
  interceptFrom={['/gallery', '/profile']}
  modalComponent={PhotoModal}
  pageComponent={PhotoPage}
/>
```

## Route Search

Fuzzy search through routes:

```tsx
import { useRouteSearch } from '@forgedevstack/forge-compass';

function CommandPalette() {
  const { searchRoutes, flatRoutes } = useRouteSearch();
  const [query, setQuery] = useState('');
  
  const results = searchRoutes(query);
  
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {results.map(({ route, score }) => (
        <Link key={route.path} to={route.path}>
          {route.meta?.title || route.path}
        </Link>
      ))}
    </div>
  );
}
```

## Typed Route Params

Type-safe params inferred from path pattern:

```tsx
import { useTypedParams, createTypedRoute, buildTypedPath } from '@forgedevstack/forge-compass';

// Auto-infer params from path
function UserPost() {
  const { userId, postId } = useTypedParams<'/users/:userId/posts/:postId'>();
  // userId: string, postId: string - fully typed!
}

// Create typed route config
const userRoute = createTypedRoute('/users/:userId');

// Build path with type checking
const path = buildTypedPath('/users/:userId/posts/:postId', {
  userId: '123',
  postId: '456',
}); // '/users/123/posts/456'

// Use getPath helper
const userPath = userRoute.getPath({ userId: '123' }); // '/users/123'
```

## SSR Support

Server-side rendering utilities:

```tsx
import { 
  createServerRouter, 
  handleRequest, 
  renderHeadToString 
} from '@forgedevstack/forge-compass/server';

// Express/Node server
app.get('*', async (req, res) => {
  const router = createServerRouter(routes);
  
  const { route, loaderData, head, redirect, status } = await handleRequest(
    new Request(`http://localhost${req.url}`),
    routes
  );
  
  if (redirect) {
    return res.redirect(redirect);
  }
  
  const headHtml = renderHeadToString(head);
  
  res.status(status).send(`
    <!DOCTYPE html>
    <html>
      <head>${headHtml}</head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__LOADER_DATA__ = ${JSON.stringify(loaderData)};
        </script>
      </body>
    </html>
  `);
});
```

## Hooks Reference

| Hook | Description |
|------|-------------|
| `useRouter()` | Access router instance |
| `useRoute()` | Current route context |
| `useParams<T>()` | Route parameters |
| `useQuery<T>()` | Query string params |
| `useNavigate()` | Navigation methods |
| `useBreadcrumbs()` | Breadcrumb trail |
| `useRouteMatch(pattern)` | Match current route |
| `useGuard(guard)` | Check guard manually |
| `useBlocker()` | Block navigation (unsaved changes) |
| `useQueryState()` | Sync state with URL query |
| `useQueryParam()` | Single query param |
| `usePrefetch()` | Prefetch routes |
| `useScrollRestoration()` | Manage scroll position |
| `useFocus()` | Focus management |
| `useLoaderData<T>()` | Load route data with caching |
| `useAction<T>()` | Handle form submissions |
| `useNavigation()` | Navigation state (loading/submitting) |
| `usePendingLocation()` | Pending route during navigation |
| `useViewTransition()` | Native View Transitions API |
| `useMiddleware()` | Add per-component middleware |
| `useRouteSearch()` | Fuzzy search routes |
| `useParallelRoutes()` | Control parallel route slots |
| `useSlot()` | Individual slot management |
| `useInterceptedRoute()` | Interception state |
| `useTypedParams<T>()` | Type-inferred params from path |
| `useTypedQuery<T>()` | Typed query string params |

## Part of ForgeStack

- [Bear UI](https://github.com/forgedevstack/bear) - Component library
- [Forge Query](https://github.com/forgedevstack/forge-query) - Data fetching
- [Forge Form](https://github.com/forgedevstack/forge-form) - Form management
- [Synapse](https://github.com/forgedevstack/synapse) - State management

## License

MIT

