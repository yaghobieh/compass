import type {
  CoreRouterConfig,
  CoreRouteConfig,
  RouterState,
  RouteContext,
  RouteParams,
  NavigateOptions,
  Guard,
  GuardFn,
  GuardResult,
  CompassLogEntry,
  RouterListener,
  DevToolsCallback,
} from '../types/core';
import { DEFAULT_CONFIG, NUMBERS } from '../constants';
import {
  matchRoute,
  createRouteContext,
  resolvePath,
  findRouteByName,
  scrollToTop,
  updateDocumentTitle,
  updateMetaTags,
  parsePath,
  buildPath,
  generateId,
} from '../utils';

export class CompassRouter<TRoute extends CoreRouteConfig = CoreRouteConfig> {
  private config: CoreRouterConfig<TRoute>;
  private state: RouterState;
  private listeners: Set<RouterListener> = new Set();
  private devToolsCallback: DevToolsCallback | null = null;
  private guardRegistry: Map<string, Guard> = new Map();
  private unlisten: (() => void) | null = null;
  private _routes: TRoute[];

  constructor(config: CoreRouterConfig<TRoute>) {
    this._routes = config.routes || [];
    this.config = { 
      ...DEFAULT_CONFIG, 
      ...config,
      routes: this._routes,
    };
    this.state = {
      currentRoute: null,
      previousRoute: null,
      isNavigating: false,
      isLoading: false,
      error: null,
      history: [],
    };

    this.registerForDevTools();
    this.setupHistoryListener();
    this.handleInitialRoute();
  }

  private get routes(): TRoute[] {
    return this._routes;
  }

  private guardsFor(route: CoreRouteConfig): (Guard | GuardFn | string)[] {
    const guards = [...(route.guards ?? [])];
    if (typeof route.fn === 'string' && !guards.includes(route.fn)) {
      guards.push(route.fn);
    }
    return guards;
  }

  private leaveGuards(route: CoreRouteConfig): (Guard | GuardFn | string)[] {
    if (route.canDeactivate == null) return [];
    const list = Array.isArray(route.canDeactivate) ? route.canDeactivate : [route.canDeactivate];
    return list.filter((hook): hook is Guard | GuardFn | string => {
      if (typeof hook === 'function' || typeof hook === 'string') return true;
      return !!hook && typeof hook === 'object' && 'check' in hook && 'name' in hook;
    });
  }

  private registerForDevTools(): void {
    if (typeof window !== 'undefined') {
      // Always register the current router (overwrite if exists)
      (window as any).__FORGE_COMPASS_ROUTER__ = this;
    }
  }

  private setupHistoryListener(): void {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const path = this.getCurrentPath();
      this.navigateInternal(path, { replace: true, skipHistoryUpdate: true });
    };

    window.addEventListener('popstate', handlePopState);
    this.unlisten = () => window.removeEventListener('popstate', handlePopState);
  }

  private getCurrentPath(): string {
    if (typeof window === 'undefined') return '/';
    
    if (this.config.mode === 'hash') {
      return window.location.hash.slice(1) || '/';
    }
    
    const { pathname, search, hash } = window.location;
    const basePath = this.config.basePath ?? '';
    const path = pathname.startsWith(basePath) 
      ? pathname.slice(basePath.length) || '/'
      : pathname;
    
    return path + search + hash;
  }

  private handleInitialRoute(): void {
    const path = this.getCurrentPath();
    const { pathname, query, hash } = parsePath(path);
    const match = matchRoute(this.routes, pathname);

    if (!match) {
      this.navigateInternal(path, { replace: true });
      return;
    }

    const guards = match.matched.flatMap((r) => this.guardsFor(r));
    const hasGuards = guards.length > 0 || (this.config.defaultGuards?.length ?? 0) > 0;

    if (hasGuards) {
      this.navigateInternal(path, { replace: true });
      return;
    }

    const context = createRouteContext(
      buildPath(pathname, query, hash),
      match.params,
      match.route,
      undefined
    );
    this.updateBrowserHistory(buildPath(pathname, query, hash), { replace: true });
    const newHistory = [...this.state.history, context].slice(-NUMBERS.MAX_HISTORY);
    this.updateState({
      currentRoute: context,
      previousRoute: null,
      isNavigating: false,
      history: newHistory,
    });
    this.config.onNavigate?.(context, null);
    this.handleScrollBehavior(context, null);
    updateDocumentTitle(context.meta.title);
    updateMetaTags(context.meta);
  }

  private updateState(newState: Partial<RouterState>): void {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  private log(entry: Omit<CompassLogEntry, 'id' | 'timestamp'>): void {
    if (!this.devToolsCallback) return;
    this.devToolsCallback({
      ...entry,
      id: generateId(),
      timestamp: Date.now(),
    });
  }

  private async runGuards(
    guards: (Guard | GuardFn | string)[],
    context: RouteContext
  ): Promise<{ passed: boolean; result?: GuardResult; guardName?: string }> {
    const defaultGuards = this.config.defaultGuards ?? [];
    const allGuards = [...defaultGuards, ...guards];

    for (const guard of allGuards) {
      const startTime = Date.now();
      let guardName = 'anonymous';
      let checkFn: GuardFn;

      if (typeof guard === 'string') {
        const registered = this.guardRegistry.get(guard);
        if (!registered) {
          continue;
        }
        guardName = registered.name;
        checkFn = registered.check;
      } else if (typeof guard === 'function') {
        checkFn = guard;
      } else {
        guardName = guard.name;
        checkFn = guard.check;
      }

      try {
        const result = await Promise.race([
          Promise.resolve(checkFn(context)),
          new Promise<GuardResult>((_, reject) =>
            setTimeout(() => reject(new Error('Guard timeout')), NUMBERS.GUARD_TIMEOUT)
          ),
        ]);

        const duration = Date.now() - startTime;
        this.log({
          type: 'guard',
          to: context.path,
          guardName,
          guardResult: result,
          duration,
        });

        if (!result.allowed) {
          if (typeof guard !== 'string' && typeof guard !== 'function' && guard.onDeny) {
            guard.onDeny(result, context);
          }
          this.config.onGuardDeny?.(result, context);
          return { passed: false, result, guardName };
        }
      } catch (error) {
        this.log({
          type: 'error',
          to: context.path,
          guardName,
          error: String(error),
        });
        return { 
          passed: false, 
          result: { allowed: false, reason: String(error) }, 
          guardName 
        };
      }
    }

    return { passed: true };
  }

  private async navigateInternal(
    to: string,
    options: NavigateOptions = {}
  ): Promise<void> {
    const startTime = Date.now();
    const previousRoute = this.state.currentRoute;

    this.updateState({ isNavigating: true, error: null });

    const { pathname, query, hash } = parsePath(to);
    const match = matchRoute(this.routes, pathname);

    if (!match) {
      this.log({ type: 'error', to: pathname, from: previousRoute?.path, error: 'Route not found' });
      this.updateState({ 
        isNavigating: false, 
        error: new Error(`Route not found: ${pathname}`) 
      });
      return;
    }

    const context = createRouteContext(
      buildPath(pathname, query, hash),
      match.params,
      match.route,
      options.state
    );

    if (previousRoute) {
      const previousMatch = matchRoute(this.routes, previousRoute.path);
      const leaving = previousMatch?.matched.flatMap((route) => this.leaveGuards(route)) ?? [];
      if (leaving.length > 0) {
        const leaveResult = await this.runGuards(leaving, previousRoute);
        if (!leaveResult.passed) {
          this.updateState({ isNavigating: false });
          return;
        }
      }
    }

    const guards = match.matched.flatMap((r) => this.guardsFor(r));
    const { passed, result } = await this.runGuards(guards, context);

    if (!passed) {
      this.updateState({ isNavigating: false });
      
      if (result && !result.allowed && result.redirect) {
        this.log({ type: 'redirect', to: result.redirect, from: pathname });
        await this.navigateInternal(result.redirect, { replace: true });
      }
      return;
    }

    if (match.route.redirect) {
      this.log({ type: 'redirect', to: match.route.redirect, from: pathname });
      await this.navigateInternal(match.route.redirect, { replace: true });
      return;
    }

    if (!options.skipHistoryUpdate) {
      this.updateBrowserHistory(buildPath(pathname, query, hash), options);
    }

    const newHistory = [...this.state.history, context].slice(-NUMBERS.MAX_HISTORY);

    this.updateState({
      currentRoute: context,
      previousRoute,
      isNavigating: false,
      history: newHistory,
    });

    this.config.onNavigate?.(context, previousRoute);

    this.handleScrollBehavior(context, previousRoute);
    updateDocumentTitle(context.meta.title);
    updateMetaTags(context.meta);

    const duration = Date.now() - startTime;
    this.log({ type: 'navigate', to: pathname, from: previousRoute?.path, duration });
  }

  private updateBrowserHistory(path: string, options: NavigateOptions): void {
    if (typeof window === 'undefined') return;

    const basePath = this.config.basePath ?? '';
    const fullPath = this.config.mode === 'hash' 
      ? `#${path}` 
      : basePath + path;

    if (options.replace) {
      window.history.replaceState(options.state, '', fullPath);
    } else {
      window.history.pushState(options.state, '', fullPath);
    }
  }

  private handleScrollBehavior(
    to: RouteContext,
    from: RouteContext | null
  ): void {
    const { scrollBehavior } = this.config;

    if (typeof scrollBehavior === 'function') {
      scrollBehavior(to, from);
    } else if (scrollBehavior === 'top') {
      scrollToTop();
    }
  }

  // Public API
  navigate = (to: string, options?: NavigateOptions): void => {
    this.navigateInternal(to, options);
  };

  push = (to: string, options?: NavigateOptions): void => {
    this.navigate(to, { ...options, replace: false });
  };

  replace = (to: string, options?: NavigateOptions): void => {
    this.navigate(to, { ...options, replace: true });
  };

  back = (): void => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  forward = (): void => {
    if (typeof window !== 'undefined') {
      window.history.forward();
    }
  };

  go = (delta: number): void => {
    if (typeof window !== 'undefined') {
      window.history.go(delta);
    }
  };

  getCurrentRoute = (): RouteContext | null => {
    return this.state.currentRoute;
  };

  getState = (): RouterState => {
    return this.state;
  };

  getRoutes = (): TRoute[] => {
    return this.routes;
  };

  addRoute = (route: TRoute, parentName?: string): void => {
    if (parentName) {
      const parent = findRouteByName(this.routes, parentName);
      if (parent) {
        parent.children = parent.children ?? [];
        parent.children.push(route);
      }
    } else {
      this.routes.push(route);
    }
  };

  removeRoute = (name: string): void => {
    const removeFromArray = (routes: TRoute[]): boolean => {
      const index = routes.findIndex((r) => r.name === name);
      if (index !== -1) {
        routes.splice(index, 1);
        return true;
      }
      return routes.some((r) => r.children && removeFromArray(r.children as TRoute[]));
    };
    removeFromArray(this.routes);
  };

  hasRoute = (name: string): boolean => {
    return findRouteByName(this.routes, name) !== null;
  };

  resolve = (nameOrPath: string, params?: RouteParams): string => {
    const route = findRouteByName(this.routes, nameOrPath);
    if (route) {
      return resolvePath(route.path, params);
    }
    return resolvePath(nameOrPath, params);
  };

  registerGuard = (guard: Guard): void => {
    this.guardRegistry.set(guard.name, guard);
  };

  subscribe = (listener: RouterListener): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  setDevToolsCallback = (callback: DevToolsCallback | null): void => {
    this.devToolsCallback = callback;
  };

  destroy = (): void => {
    this.unlisten?.();
    this.listeners.clear();
    if (typeof window !== 'undefined') {
      delete (window as any).__FORGE_COMPASS_ROUTER__;
    }
  };
}

export const createRouter = <TRoute extends CoreRouteConfig = CoreRouteConfig>(
  config: CoreRouterConfig<TRoute>
): CompassRouter<TRoute> => {
  return new CompassRouter(config);
};

