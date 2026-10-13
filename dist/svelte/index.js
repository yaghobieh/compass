'use strict';

// src/constants/index.ts
var NUMBERS = {
  MAX_HISTORY: 50,
  GUARD_TIMEOUT: 5e3,
  TRANSITION_DURATION: 300,
  PREFETCH_DELAY: 100,
  Z_INDEX: 9999,
  TOGGLE_WIDTH: 40,
  TOGGLE_HEIGHT: 80,
  PANEL_WIDTH: 360
};
var DEFAULT_META = {
  title: "",
  description: "",
  keywords: []
};
var DEFAULT_CONFIG = {
  routes: [],
  basePath: "",
  mode: "history",
  scrollBehavior: "top",
  defaultGuards: []
};
var ROUTE_PATTERNS = {
  OPTIONAL_PARAM: /:([^/]+)\?/g};

// src/utils/index.ts
var generateId = () => Math.random().toString(36).substring(2, 11);
var parsePath = (path) => {
  const hashIndex = path.indexOf("#");
  const queryIndex = path.indexOf("?");
  let pathname = path;
  let queryString = "";
  let hash = "";
  if (hashIndex !== -1) {
    hash = path.slice(hashIndex + 1);
    pathname = path.slice(0, hashIndex);
  }
  if (queryIndex !== -1) {
    queryString = pathname.slice(queryIndex + 1);
    pathname = pathname.slice(0, queryIndex);
  }
  const query = {};
  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((value, key) => {
      const existing = query[key];
      if (existing !== void 0) {
        query[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
      } else {
        query[key] = value;
      }
    });
  }
  return { pathname, query, hash };
};
var buildPath = (pathname, query, hash) => {
  let path = pathname;
  if (query && Object.keys(query).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else if (value !== void 0) {
        searchParams.append(key, value);
      }
    });
    path += `?${searchParams.toString()}`;
  }
  if (hash) {
    path += `#${hash}`;
  }
  return path;
};
var matchPath = (pattern, pathname) => {
  const params = {};
  if (pattern === "*" || pattern === "**") {
    return { matched: true, params: { "*": pathname } };
  }
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) {
    const hasWildcard = patternParts.some((p) => p === "*" || p === "**");
    if (!hasWildcard) {
      return { matched: false, params };
    }
  }
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];
    if (patternPart === "*" || patternPart === "**") {
      params["*"] = pathParts.slice(i).join("/");
      return { matched: true, params };
    }
    if (patternPart.startsWith(":")) {
      const paramName = patternPart.slice(1).replace("?", "");
      const isOptional = patternPart.endsWith("?");
      if (!pathPart && !isOptional) {
        return { matched: false, params };
      }
      if (pathPart) {
        params[paramName] = pathPart;
      }
    } else if (patternPart !== pathPart) {
      return { matched: false, params };
    }
  }
  return { matched: true, params };
};
var canMatchAllows = (route, pathname) => {
  if (route.canMatch == null) return true;
  const list = Array.isArray(route.canMatch) ? route.canMatch : [route.canMatch];
  for (const hook of list) {
    if (typeof hook !== "function") continue;
    try {
      const result = hook(pathname, route);
      if (result === false) return false;
      if (result && typeof result === "object" && "allowed" in result && result.allowed === false) {
        return false;
      }
    } catch {
    }
  }
  return true;
};
var matchRoute = (routes, pathname, parentPath = "") => {
  for (const route of routes) {
    const fullPath = joinPaths(parentPath, route.path);
    const { matched, params } = matchPath(fullPath, pathname);
    if (matched && canMatchAllows(route, pathname)) {
      if (route.children && route.children.length > 0) {
        const childMatch = matchRoute(route.children, pathname, fullPath);
        if (childMatch) {
          return {
            route: childMatch.route,
            params: { ...params, ...childMatch.params },
            matched: [route, ...childMatch.matched]
          };
        }
      }
      return {
        route,
        params,
        matched: [route]
      };
    }
  }
  return null;
};
var joinPaths = (...paths) => {
  return "/" + paths.map((p) => p.replace(/^\/|\/$/g, "")).filter(Boolean).join("/");
};
var resolvePath = (pattern, params = {}) => {
  let resolved = pattern;
  Object.entries(params).forEach(([key, value]) => {
    resolved = resolved.replace(`:${key}`, value);
    resolved = resolved.replace(`:${key}?`, value);
  });
  resolved = resolved.replace(ROUTE_PATTERNS.OPTIONAL_PARAM, "");
  return resolved;
};
var createRouteContext = (path, params = {}, route, state) => {
  const { pathname, query, hash } = parsePath(path);
  return {
    path: pathname,
    params,
    query,
    hash,
    state,
    meta: route?.meta ?? { ...DEFAULT_META }
  };
};
var findRouteByName = (routes, name) => {
  for (const route of routes) {
    if (route.name === name) {
      return route;
    }
    if (route.children) {
      const found = findRouteByName(route.children, name);
      if (found) return found;
    }
  }
  return null;
};
var scrollToTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
var updateDocumentTitle = (title) => {
  if (typeof document !== "undefined" && title) {
    document.title = title;
  }
};
var updateMetaTags = (meta) => {
  if (typeof document === "undefined" || !meta) return;
  const updateMeta = (name, content) => {
    if (!content) return;
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };
  if (meta.description) updateMeta("description", meta.description);
  if (meta.keywords?.length) updateMeta("keywords", meta.keywords.join(", "));
  if (meta.og) {
    const updateOg = (prop, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[property="og:${prop}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", `og:${prop}`);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    updateOg("title", meta.og.title);
    updateOg("description", meta.og.description);
    updateOg("image", meta.og.image);
  }
};

// src/core/Router.ts
var CompassRouter = class {
  constructor(config) {
    this.listeners = /* @__PURE__ */ new Set();
    this.devToolsCallback = null;
    this.guardRegistry = /* @__PURE__ */ new Map();
    this.unlisten = null;
    // Public API
    this.navigate = (to, options) => {
      this.navigateInternal(to, options);
    };
    this.push = (to, options) => {
      this.navigate(to, { ...options, replace: false });
    };
    this.replace = (to, options) => {
      this.navigate(to, { ...options, replace: true });
    };
    this.back = () => {
      if (typeof window !== "undefined") {
        window.history.back();
      }
    };
    this.forward = () => {
      if (typeof window !== "undefined") {
        window.history.forward();
      }
    };
    this.go = (delta) => {
      if (typeof window !== "undefined") {
        window.history.go(delta);
      }
    };
    this.getCurrentRoute = () => {
      return this.state.currentRoute;
    };
    this.getState = () => {
      return this.state;
    };
    this.getRoutes = () => {
      return this.routes;
    };
    this.addRoute = (route, parentName) => {
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
    this.removeRoute = (name) => {
      const removeFromArray = (routes) => {
        const index = routes.findIndex((r) => r.name === name);
        if (index !== -1) {
          routes.splice(index, 1);
          return true;
        }
        return routes.some((r) => r.children && removeFromArray(r.children));
      };
      removeFromArray(this.routes);
    };
    this.hasRoute = (name) => {
      return findRouteByName(this.routes, name) !== null;
    };
    this.resolve = (nameOrPath, params) => {
      const route = findRouteByName(this.routes, nameOrPath);
      if (route) {
        return resolvePath(route.path, params);
      }
      return resolvePath(nameOrPath, params);
    };
    this.registerGuard = (guard) => {
      this.guardRegistry.set(guard.name, guard);
    };
    this.subscribe = (listener) => {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    };
    this.setDevToolsCallback = (callback) => {
      this.devToolsCallback = callback;
    };
    this.destroy = () => {
      this.unlisten?.();
      this.listeners.clear();
      if (typeof window !== "undefined") {
        delete window.__FORGE_COMPASS_ROUTER__;
      }
    };
    this._routes = config.routes || [];
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      routes: this._routes
    };
    this.state = {
      currentRoute: null,
      previousRoute: null,
      isNavigating: false,
      isLoading: false,
      error: null,
      history: []
    };
    this.registerForDevTools();
    this.setupHistoryListener();
    this.handleInitialRoute();
  }
  get routes() {
    return this._routes;
  }
  guardsFor(route) {
    const guards = [...route.guards ?? []];
    if (typeof route.fn === "string" && !guards.includes(route.fn)) {
      guards.push(route.fn);
    }
    return guards;
  }
  leaveGuards(route) {
    if (route.canDeactivate == null) return [];
    const list = Array.isArray(route.canDeactivate) ? route.canDeactivate : [route.canDeactivate];
    return list.filter((hook) => {
      if (typeof hook === "function" || typeof hook === "string") return true;
      return !!hook && typeof hook === "object" && "check" in hook && "name" in hook;
    });
  }
  registerForDevTools() {
    if (typeof window !== "undefined") {
      window.__FORGE_COMPASS_ROUTER__ = this;
    }
  }
  setupHistoryListener() {
    if (typeof window === "undefined") return;
    const handlePopState = () => {
      const path = this.getCurrentPath();
      this.navigateInternal(path, { replace: true, skipHistoryUpdate: true });
    };
    window.addEventListener("popstate", handlePopState);
    this.unlisten = () => window.removeEventListener("popstate", handlePopState);
  }
  getCurrentPath() {
    if (typeof window === "undefined") return "/";
    if (this.config.mode === "hash") {
      return window.location.hash.slice(1) || "/";
    }
    const { pathname, search, hash } = window.location;
    const basePath = this.config.basePath ?? "";
    const path = pathname.startsWith(basePath) ? pathname.slice(basePath.length) || "/" : pathname;
    return path + search + hash;
  }
  handleInitialRoute() {
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
      void 0
    );
    this.updateBrowserHistory(buildPath(pathname, query, hash), { replace: true });
    const newHistory = [...this.state.history, context].slice(-50);
    this.updateState({
      currentRoute: context,
      previousRoute: null,
      isNavigating: false,
      history: newHistory
    });
    this.config.onNavigate?.(context, null);
    this.handleScrollBehavior(context, null);
    updateDocumentTitle(context.meta.title);
    updateMetaTags(context.meta);
  }
  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }
  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }
  log(entry) {
    if (!this.devToolsCallback) return;
    this.devToolsCallback({
      ...entry,
      id: generateId(),
      timestamp: Date.now()
    });
  }
  async runGuards(guards, context) {
    const defaultGuards = this.config.defaultGuards ?? [];
    const allGuards = [...defaultGuards, ...guards];
    for (const guard of allGuards) {
      const startTime = Date.now();
      let guardName = "anonymous";
      let checkFn;
      if (typeof guard === "string") {
        const registered = this.guardRegistry.get(guard);
        if (!registered) {
          continue;
        }
        guardName = registered.name;
        checkFn = registered.check;
      } else if (typeof guard === "function") {
        checkFn = guard;
      } else {
        guardName = guard.name;
        checkFn = guard.check;
      }
      try {
        const result = await Promise.race([
          Promise.resolve(checkFn(context)),
          new Promise(
            (_, reject) => setTimeout(() => reject(new Error("Guard timeout")), NUMBERS.GUARD_TIMEOUT)
          )
        ]);
        const duration = Date.now() - startTime;
        this.log({
          type: "guard",
          to: context.path,
          guardName,
          guardResult: result,
          duration
        });
        if (!result.allowed) {
          if (typeof guard !== "string" && typeof guard !== "function" && guard.onDeny) {
            guard.onDeny(result, context);
          }
          this.config.onGuardDeny?.(result, context);
          return { passed: false, result, guardName };
        }
      } catch (error) {
        this.log({
          type: "error",
          to: context.path,
          guardName,
          error: String(error)
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
  async navigateInternal(to, options = {}) {
    const startTime = Date.now();
    const previousRoute = this.state.currentRoute;
    this.updateState({ isNavigating: true, error: null });
    const { pathname, query, hash } = parsePath(to);
    const match = matchRoute(this.routes, pathname);
    if (!match) {
      this.log({ type: "error", to: pathname, from: previousRoute?.path, error: "Route not found" });
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
        this.log({ type: "redirect", to: result.redirect, from: pathname });
        await this.navigateInternal(result.redirect, { replace: true });
      }
      return;
    }
    if (match.route.redirect) {
      this.log({ type: "redirect", to: match.route.redirect, from: pathname });
      await this.navigateInternal(match.route.redirect, { replace: true });
      return;
    }
    if (!options.skipHistoryUpdate) {
      this.updateBrowserHistory(buildPath(pathname, query, hash), options);
    }
    const newHistory = [...this.state.history, context].slice(-50);
    this.updateState({
      currentRoute: context,
      previousRoute,
      isNavigating: false,
      history: newHistory
    });
    this.config.onNavigate?.(context, previousRoute);
    this.handleScrollBehavior(context, previousRoute);
    updateDocumentTitle(context.meta.title);
    updateMetaTags(context.meta);
    const duration = Date.now() - startTime;
    this.log({ type: "navigate", to: pathname, from: previousRoute?.path, duration });
  }
  updateBrowserHistory(path, options) {
    if (typeof window === "undefined") return;
    const basePath = this.config.basePath ?? "";
    const fullPath = this.config.mode === "hash" ? `#${path}` : basePath + path;
    if (options.replace) {
      window.history.replaceState(options.state, "", fullPath);
    } else {
      window.history.pushState(options.state, "", fullPath);
    }
  }
  handleScrollBehavior(to, from) {
    const { scrollBehavior } = this.config;
    if (typeof scrollBehavior === "function") {
      scrollBehavior(to, from);
    } else if (scrollBehavior === "top") {
      scrollToTop();
    }
  }
};
var createRouter = (config) => {
  return new CompassRouter(config);
};

// src/utils/componentRegistry.ts
var registry = /* @__PURE__ */ new Map();
var registerComponent = (name, component) => {
  registry.set(name, component);
};
var getComponent = (name) => {
  return registry.get(name);
};
var resolveComponentRef = (component) => {
  if (typeof component !== "string") return component;
  return registry.get(component) ?? component;
};
var resolveRouteComponents = (routes) => {
  return routes.map((route) => ({
    ...route,
    component: resolveComponentRef(route.component),
    layout: resolveComponentRef(route.layout),
    children: route.children ? resolveRouteComponents(route.children) : route.children
  }));
};

// src/utils/routeSpec.ts
var ROUTE_SPEC = /^(\S+)\s+(\S+)\s+(\/\S+)\s+<?([A-Za-z_][A-Za-z0-9_]*)>?$/;
var parseRouteSpec = (spec) => {
  const match = spec.trim().match(ROUTE_SPEC);
  if (!match) {
    throw new Error(
      `Invalid route spec: "${spec}". Expected "name fn /path Component", for example "auth function /auth/:id <UserPage>".`
    );
  }
  return {
    name: match[1],
    fn: match[2],
    path: match[3],
    component: match[4]
  };
};

// src/utils/createRoute.ts
function createRoute(pathOrConfig, component, options) {
  if (pathOrConfig !== null && typeof pathOrConfig === "object") {
    if (!pathOrConfig.path) {
      throw new Error("createRoute object requires a path.");
    }
    const { component: objectComponent, ...rest } = pathOrConfig;
    return {
      ...rest,
      path: pathOrConfig.path,
      component: resolveComponentRef(objectComponent)
    };
  }
  if (arguments.length === 1) {
    const parsed = parseRouteSpec(pathOrConfig);
    return {
      name: parsed.name,
      fn: parsed.fn,
      path: parsed.path,
      component: resolveComponentRef(parsed.component)
    };
  }
  return {
    path: pathOrConfig,
    component: resolveComponentRef(component),
    ...options
  };
}

// src/adapters/svelte/index.ts
var normalizeSvelteRoute = (route) => {
  const guards = [...route.guards ?? []];
  if (typeof route.fn === "function") guards.push(route.fn);
  return {
    ...route,
    guards,
    children: route.children?.map(normalizeSvelteRoute)
  };
};
var loaderContext = (current) => ({
  params: current.params,
  query: current.query,
  request: new Request(`http://localhost${current.path}`),
  signal: new AbortController().signal
});
var createCompassRouter = (routes, options) => {
  const router = createRouter({
    ...options,
    routes: routes.map(normalizeSvelteRoute)
  });
  const loaderData = /* @__PURE__ */ new Map();
  let lastKey = "";
  const refreshLoaders = async (current) => {
    const match = matchRoute(router.getRoutes(), current.path);
    if (!match) return;
    for (const route of match.matched) {
      if (typeof route.loader !== "function") continue;
      const data = await route.loader(loaderContext(current));
      loaderData.set(route.name ?? route.path, data);
    }
  };
  const track = () => {
    const current = router.getCurrentRoute();
    if (!current) return;
    const key = `${current.path}:${JSON.stringify(current.params)}`;
    if (key === lastKey) return;
    lastKey = key;
    void refreshLoaders(current);
  };
  router.subscribe(track);
  track();
  return Object.assign(router, {
    getLoaderData: (name) => {
      if (name) return loaderData.get(name);
      return Object.fromEntries(loaderData);
    },
    getParams: () => router.getCurrentRoute()?.params ?? {}
  });
};
var Route = (config) => normalizeSvelteRoute(config);
var Link = (router) => {
  return {
    props(to, replace = false) {
      return {
        href: to,
        onclick: (event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
          event.preventDefault();
          router.navigate(to, { replace });
        }
      };
    }
  };
};
var readOutlet = (router, depth) => {
  const current = router.getCurrentRoute();
  if (!current) return null;
  const match = matchRoute(router.getRoutes(), current.path);
  const route = match?.matched[depth];
  if (!route) return null;
  return {
    component: resolveComponentRef(route.component),
    params: current.params,
    route,
    context: current
  };
};
var mountComponent = (target, view) => {
  const component = view.component;
  if (!component || typeof component === "string") return () => {
  };
  if (typeof component === "object" && component && "mount" in component && typeof component.mount === "function") {
    const stop = component.mount(target, view);
    return typeof stop === "function" ? stop : () => {
    };
  }
  if (typeof component === "function") {
    try {
      const instance = new component({
        target,
        props: { params: view.params, route: view.context }
      });
      return () => instance.$destroy?.();
    } catch {
      return () => {
      };
    }
  }
  return () => {
  };
};
var Outlet = (router, depth = 0) => {
  return {
    read: () => readOutlet(router, depth),
    subscribe(listener) {
      const emit = () => listener(readOutlet(router, depth));
      emit();
      return router.subscribe(emit);
    },
    mount(target) {
      let destroy = () => {
      };
      const render = () => {
        destroy();
        target.replaceChildren();
        const view = readOutlet(router, depth);
        destroy = view ? mountComponent(target, view) : () => {
        };
      };
      render();
      const unsubscribe = router.subscribe(render);
      return () => {
        unsubscribe();
        destroy();
      };
    }
  };
};

exports.Link = Link;
exports.Outlet = Outlet;
exports.Route = Route;
exports.createCompassRouter = createCompassRouter;
exports.createRoute = createRoute;
exports.getComponent = getComponent;
exports.registerComponent = registerComponent;
exports.resolveRouteComponents = resolveRouteComponents;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map