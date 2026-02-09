# Changelog

## 1.2.1 (2026-02-05)

### Improvements
- **DevTools**: Complete redesign with improved clarity
  - Uses Bear UI components exclusively
  - Dark/Light theme toggle
  - Clear success/failure indicators with icons (✓/✗)
  - Expandable log entries with detailed guard information
  - Stats row showing counts (Success, Guards, Failed, Redirects)
  - Three tabs: Navigation Log, Routes, History
  - Proper error/success alerts for guard results
  - Shows redirect targets when guard blocks navigation

### Bug Fixes
- **DevTools**: Fixed navigation logging not showing any events
  - Added retry mechanism to connect to router after lazy load
  - DevTools now logs the initial route when it mounts
  - Router now always registers to window for DevTools access
- **Demo**: Added nested routes example with Dashboard sub-navigation

---

## 1.2.0 (2026-02-03)

### Major New Features

#### Route Loaders (Data Fetching)
- `useLoaderData<T>()` - Load data for routes with caching and revalidation
- `createLoader()` - Helper to define typed loaders
- Options: `revalidateOnFocus`, `revalidateOnReconnect`, `staleTime`

#### Route Actions (Form Submissions)
- `useAction<T>()` - Handle form submissions with state management
- `createAction()` - Helper to define typed actions
- Built-in redirect support, error handling, and revalidation

#### Pending UI / Navigation State
- `useNavigation()` - Get current navigation state (idle/loading/submitting)
- `usePendingLocation()` - Access pending route during navigation

#### View Transitions API
- `useViewTransition()` - Native browser View Transitions support
- `ViewTransitionLink` - Link component with view transitions
- Automatic fallback for unsupported browsers

#### Route Middleware
- `useMiddleware()` - Add per-component middleware
- `registerMiddleware()` - Global middleware registration
- `createMiddleware()` - Named middleware factory
- Built-in: `loggerMiddleware`, `analyticsMiddleware`

#### Parallel Routes
- `ParallelRoutesProvider` - Enable multiple concurrent views
- `ParallelOutlet` - Named slots for parallel routes
- `useParallelRoutes()` - Control slot state
- `useSlot()` - Individual slot management

#### Intercepting Routes
- `InterceptingRoute` - Modal pattern for route interception
- `useInterceptedRoute()` - Get interception state
- Configure which routes can intercept

#### Route Search
- `useRouteSearch()` - Fuzzy search through routes
- `CommandPalette` - Ready-to-use command palette component
- Search by path, name, or title

#### Typed Route Params
- `useTypedParams<'/users/:id'>()` - Type-inferred params from path
- `useTypedQuery<T>()` - Typed query string params
- `defineRoute()` - Type-safe route definition
- `buildTypedPath()` - Build paths with typed params
- `createTypedRoute()` - Full typed route config

#### SSR Support
- `@forgedevstack/forge-compass/server` - Server-side rendering utilities
- `createServerRouter()` - Server router instance
- `handleRequest()` - Process incoming requests
- `loadRouteData()` - Pre-load route data on server
- `renderHeadToString()` - Generate meta tags

### New Exports

```tsx
// Loaders & Actions
useLoaderData, createLoader, useAction, createAction

// Navigation State
useNavigation, usePendingLocation

// View Transitions
useViewTransition, ViewTransitionLink

// Middleware
useMiddleware, registerMiddleware, clearMiddleware,
runMiddleware, createMiddleware, loggerMiddleware, analyticsMiddleware

// Route Search
useRouteSearch, CommandPalette

// Parallel Routes
ParallelRoutesProvider, useParallelRoutes, ParallelOutlet, useSlot

// Intercepting Routes
InterceptingRoute, useInterceptedRoute

// Typed Params
useTypedParams, useTypedQuery, defineRoute, buildTypedPath, createTypedRoute

// SSR (from @forgedevstack/forge-compass/server)
createServerRouter, handleRequest, loadRouteData, renderHeadToString
```

## 1.1.0 (2026-02-03)

### New Features

- **Navigation Blocking**: `useBlocker` hook for unsaved changes protection
- **Loading Progress Bar**: `showProgress` prop with customizable color
- **Route Prefetching**: `usePrefetch` and `useIntersectionPrefetch` hooks
- **Scroll Restoration**: `useScrollRestoration` hook with auto/manual modes
- **Route Transitions**: `Transition` component with fade/slide effects
- **Error Boundaries**: `RouteErrorBoundary` component per route
- **Route Announcer**: Accessibility announcements for screen readers
- **Focus Management**: `useFocus` hook for accessible navigation
- **Query State Sync**: `useQueryState` and `useQueryParam` hooks
- **Route Groups**: `routeGroup` helper for shared configuration

### Provider Options

- `showProgress` - Enable loading progress bar
- `progressColor` - Customize progress bar color
- `scrollRestoration` - 'auto' | 'manual' | 'disabled'
- `announceRoutes` - Enable screen reader announcements
- `announceFormat` - Custom announcement format function
- `transition` - Route transition type
- `transitionDuration` - Transition duration in ms

## 1.0.1 (2026-02-03)

### Improvements

- DevTools now optional via `devTools` prop in `CompassProvider`
- Moved types to centralized types file for cleaner architecture
- Removed unused console logs - only show in DevTools if enabled
- New professional compass logo and icon
- Added demo application with guards example
- Fixed unused variable warnings

### DevTools

- `devTools` prop on `CompassProvider` to enable without separate import
- `devToolsPosition` prop to set panel position (`left` | `right`)
- `showConsoleLog` prop removed (no logs by default)

## 1.0.0 (2026-02-03)

### Features

- 🎉 Initial release
- 🛡️ Route guards with async support
- 📝 Array-based route configuration
- 🔒 Built-in guards: auth, role, permission, feature, conditional
- ⚡ Lazy loading support
- 🧩 Nested routes with layouts and outlets
- 🔧 DevTools panel for debugging
- 🎨 Integration with Bear UI
- 📦 TypeScript support with full type inference

