import { createContext, useState, useRef, useEffect, lazy, useMemo, Suspense, useContext, useCallback, Component, Children, isValidElement } from 'react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import '@forgedevstack/bear/styles.css';
import { BearIcons, BearProvider, Button, Box, Flex, Typography, Switch, Card, CardBody, Badge, Tabs, TabList, Tab, TabPanel, Alert } from '@forgedevstack/bear';

var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/constants/index.ts
var VERSION, NUMBERS, DEFAULT_META, DEFAULT_CONFIG, ROUTE_PATTERNS, GUARD_RESULTS;
var init_constants = __esm({
  "src/constants/index.ts"() {
    VERSION = "1.0.0" ;
    NUMBERS = {
      MAX_HISTORY: 50,
      GUARD_TIMEOUT: 5e3,
      TRANSITION_DURATION: 300,
      PREFETCH_DELAY: 100,
      Z_INDEX: 9999,
      TOGGLE_WIDTH: 40,
      TOGGLE_HEIGHT: 80,
      PANEL_WIDTH: 360
    };
    DEFAULT_META = {
      title: "",
      description: "",
      keywords: []
    };
    DEFAULT_CONFIG = {
      routes: [],
      basePath: "",
      mode: "history",
      scrollBehavior: "top",
      defaultGuards: []
    };
    ROUTE_PATTERNS = {
      PARAM: /:([^/]+)/g,
      OPTIONAL_PARAM: /:([^/]+)\?/g,
      WILDCARD: /\*/g,
      CATCH_ALL: /\*\*/g
    };
    GUARD_RESULTS = {
      ALLOW: { allowed: true },
      DENY: { allowed: false }
    };
  }
});

// src/utils/index.ts
var generateId, parsePath, buildPath, matchPath, matchRoute, joinPaths, resolvePath, createRouteContext, flattenRoutes, findRouteByName, scrollToTop, updateDocumentTitle, updateMetaTags;
var init_utils = __esm({
  "src/utils/index.ts"() {
    init_constants();
    generateId = () => Math.random().toString(36).substring(2, 11);
    parsePath = (path) => {
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
    buildPath = (pathname, query, hash) => {
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
    matchPath = (pattern, pathname) => {
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
    matchRoute = (routes2, pathname, parentPath = "") => {
      for (const route of routes2) {
        const fullPath = joinPaths(parentPath, route.path);
        const { matched, params } = matchPath(fullPath, pathname);
        if (matched) {
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
    joinPaths = (...paths) => {
      return "/" + paths.map((p) => p.replace(/^\/|\/$/g, "")).filter(Boolean).join("/");
    };
    resolvePath = (pattern, params = {}) => {
      let resolved = pattern;
      Object.entries(params).forEach(([key, value]) => {
        resolved = resolved.replace(`:${key}`, value);
        resolved = resolved.replace(`:${key}?`, value);
      });
      resolved = resolved.replace(ROUTE_PATTERNS.OPTIONAL_PARAM, "");
      return resolved;
    };
    createRouteContext = (path, params = {}, route, state) => {
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
    flattenRoutes = (routes2, parentPath = "") => {
      const result = [];
      for (const route of routes2) {
        const fullPath = joinPaths(parentPath, route.path);
        result.push({ ...route, fullPath });
        if (route.children) {
          result.push(...flattenRoutes(route.children, fullPath));
        }
      }
      return result;
    };
    findRouteByName = (routes2, name) => {
      for (const route of routes2) {
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
    scrollToTop = () => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    updateDocumentTitle = (title) => {
      if (typeof document !== "undefined" && title) {
        document.title = title;
      }
    };
    updateMetaTags = (meta) => {
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
  }
});

// src/core/Router.ts
var CompassRouter, createRouter;
var init_Router = __esm({
  "src/core/Router.ts"() {
    init_constants();
    init_utils();
    CompassRouter = class {
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
          const removeFromArray = (routes2) => {
            const index = routes2.findIndex((r) => r.name === name);
            if (index !== -1) {
              routes2.splice(index, 1);
              return true;
            }
            return routes2.some((r) => r.children && removeFromArray(r.children));
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
      registerForDevTools() {
        if (typeof window !== "undefined") {
          window.__FORGE_COMPASS_ROUTER__ = this;
        }
      }
      setupHistoryListener() {
        if (typeof window === "undefined") return;
        const handlePopState = () => {
          const path = this.getCurrentPath();
          this.navigateInternal(path, { replace: true });
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
        this.navigateInternal(path, { replace: true });
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
        const guards = match.matched.flatMap((r) => r.guards ?? []);
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
        this.updateBrowserHistory(buildPath(pathname, query, hash), options);
        const newHistory = [...this.state.history, context].slice(-NUMBERS.MAX_HISTORY);
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
    createRouter = (config) => {
      return new CompassRouter(config);
    };
  }
});
var STYLES, ProgressBar;
var init_ProgressBar = __esm({
  "src/adapters/react/ProgressBar.tsx"() {
    init_CompassContext();
    STYLES = {
      container: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        pointerEvents: "none"
      },
      bar: {
        height: 3,
        transition: "width 200ms ease-out, opacity 200ms ease-out"
      }
    };
    ProgressBar = ({
      color = "#3b82f6",
      height = 3,
      delay = 100,
      duration = 300
    }) => {
      const { state } = useCompassContext();
      const [progress, setProgress] = useState(0);
      const [visible, setVisible] = useState(false);
      const timeoutRef = useRef(null);
      const intervalRef = useRef(null);
      useEffect(() => {
        if (state.isNavigating) {
          timeoutRef.current = setTimeout(() => {
            setVisible(true);
            setProgress(10);
            intervalRef.current = setInterval(() => {
              setProgress((prev) => {
                if (prev >= 90) {
                  if (intervalRef.current) clearInterval(intervalRef.current);
                  return prev;
                }
                return prev + Math.random() * 10;
              });
            }, 200);
          }, delay);
        } else {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (visible) {
            setProgress(100);
            setTimeout(() => {
              setVisible(false);
              setProgress(0);
            }, duration);
          }
        }
        return () => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
      }, [state.isNavigating, delay, duration, visible]);
      if (!visible && progress === 0) return null;
      return /* @__PURE__ */ jsx("div", { style: STYLES.container, children: /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            ...STYLES.bar,
            height,
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            opacity: visible ? 1 : 0,
            boxShadow: `0 0 10px ${color}80, 0 0 5px ${color}40`
          }
        }
      ) });
    };
  }
});
var STYLES2, defaultFormat, RouteAnnouncer;
var init_RouteAnnouncer = __esm({
  "src/adapters/react/RouteAnnouncer.tsx"() {
    init_CompassContext();
    STYLES2 = {
      announcer: {
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0
      }
    };
    defaultFormat = (route) => {
      if (route.meta.title) {
        return `Navigated to ${route.meta.title}`;
      }
      return `Navigated to ${route.path}`;
    };
    RouteAnnouncer = ({
      format = defaultFormat,
      delay = 100
    }) => {
      const route = useRoute();
      const [announcement, setAnnouncement] = useState("");
      const previousPathRef = useRef(null);
      useEffect(() => {
        if (!route) return;
        if (previousPathRef.current !== null && previousPathRef.current !== route.path) {
          const message = format(route);
          setTimeout(() => {
            setAnnouncement("");
            requestAnimationFrame(() => {
              setAnnouncement(message);
            });
          }, delay);
        }
        previousPathRef.current = route.path;
      }, [route, format, delay]);
      return /* @__PURE__ */ jsx(
        "div",
        {
          role: "status",
          "aria-live": "polite",
          "aria-atomic": "true",
          style: STYLES2.announcer,
          children: announcement
        }
      );
    };
  }
});

// src/devtools/CompassDevTools.tsx
var CompassDevTools_exports = {};
__export(CompassDevTools_exports, {
  CompassDevTools: () => CompassDevTools
});
var CloseIcon, ChevronLeftIcon, ChevronRightIcon, DEFAULT_CONFIG2, LogEntry, CompassDevTools;
var init_CompassDevTools = __esm({
  "src/devtools/CompassDevTools.tsx"() {
    init_constants();
    init_CompassContext();
    ({ CloseIcon, ChevronLeftIcon, ChevronRightIcon } = BearIcons);
    DEFAULT_CONFIG2 = {
      enabled: true,
      position: "right",
      showConsoleLog: false,
      panelWidth: 400,
      defaultTheme: "dark"
    };
    LogEntry = ({ log, isDark }) => {
      const isSuccess = log.type === "navigate";
      const isWarning = log.type === "guard";
      const isError = log.type === "error";
      const isRedirect = log.type === "redirect";
      const guardPassed = log.guardResult?.allowed === true;
      const guardFailed = log.guardResult?.allowed === false;
      const getBadgeColor = () => {
        if (isSuccess) return "success";
        if (isError || guardFailed) return "danger";
        if (isRedirect) return "info";
        if (isWarning && guardPassed) return "success";
        if (isWarning && guardFailed) return "danger";
        return "warning";
      };
      const getIcon = () => {
        if (isSuccess) return "\u2713";
        if (isError || guardFailed) return "\u2717";
        if (isRedirect) return "\u2192";
        if (isWarning && guardPassed) return "\u2713";
        return "\u26A1";
      };
      const getTitle = () => {
        if (isSuccess) return "Navigation Success";
        if (isError) return "Navigation Error";
        if (isRedirect) return "Redirected";
        if (isWarning) return guardPassed ? "Guard Passed" : "Guard Blocked";
        return log.type;
      };
      const bgColor = isDark ? "#18181b" : "#f4f4f5";
      const borderColor = isDark ? "#27272a" : "#e4e4e7";
      const textColor = isDark ? "#fafafa" : "#18181b";
      const mutedColor = isDark ? "#71717a" : "#a1a1aa";
      return /* @__PURE__ */ jsx(
        Card,
        {
          style: {
            marginBottom: 8,
            background: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: 8
          },
          children: /* @__PURE__ */ jsxs(CardBody, { style: { padding: 12 }, children: [
            /* @__PURE__ */ jsxs(Flex, { justify: "between", align: "center", style: { marginBottom: 8 }, children: [
              /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 8, children: [
                /* @__PURE__ */ jsx(
                  Box,
                  {
                    style: {
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      background: isSuccess || isWarning && guardPassed ? "#10b98120" : isError || guardFailed ? "#ef444420" : isRedirect ? "#3b82f620" : "#f59e0b20",
                      color: isSuccess || isWarning && guardPassed ? "#10b981" : isError || guardFailed ? "#ef4444" : isRedirect ? "#3b82f6" : "#f59e0b"
                    },
                    children: getIcon()
                  }
                ),
                /* @__PURE__ */ jsxs(Box, { children: [
                  /* @__PURE__ */ jsx(Typography, { variant: "body2", style: { color: textColor, fontWeight: 600 }, children: getTitle() }),
                  /* @__PURE__ */ jsx(Typography, { variant: "caption", style: { color: mutedColor }, children: new Date(log.timestamp).toLocaleTimeString() })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Badge, { color: getBadgeColor(), size: "sm", children: log.type.toUpperCase() })
            ] }),
            /* @__PURE__ */ jsxs(
              Box,
              {
                style: {
                  padding: 10,
                  borderRadius: 6,
                  background: isDark ? "#09090b" : "#e4e4e7",
                  marginBottom: 8
                },
                children: [
                  /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 8, children: [
                    /* @__PURE__ */ jsx(Typography, { variant: "caption", style: { color: mutedColor }, children: "To:" }),
                    /* @__PURE__ */ jsx(
                      Typography,
                      {
                        variant: "body2",
                        style: {
                          color: isSuccess ? "#10b981" : isError || guardFailed ? "#ef4444" : "#3b82f6",
                          fontFamily: "monospace",
                          fontWeight: 500
                        },
                        children: log.to
                      }
                    )
                  ] }),
                  log.from && /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 8, style: { marginTop: 4 }, children: [
                    /* @__PURE__ */ jsx(Typography, { variant: "caption", style: { color: mutedColor }, children: "From:" }),
                    /* @__PURE__ */ jsx(Typography, { variant: "caption", style: { color: mutedColor, fontFamily: "monospace" }, children: log.from })
                  ] })
                ]
              }
            ),
            log.guardName && /* @__PURE__ */ jsx(
              Alert,
              {
                severity: guardPassed ? "success" : "error",
                style: { marginBottom: 8 },
                children: /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: 4, children: [
                  /* @__PURE__ */ jsxs(Typography, { variant: "body2", style: { fontWeight: 600 }, children: [
                    "Guard: ",
                    log.guardName
                  ] }),
                  /* @__PURE__ */ jsx(Typography, { variant: "caption", children: guardPassed ? "Access granted" : `Access denied${!log.guardResult?.allowed && "reason" in (log.guardResult ?? {}) ? `: ${log.guardResult.reason}` : ""}` }),
                  !log.guardResult?.allowed && "redirect" in (log.guardResult ?? {}) && log.guardResult.redirect && /* @__PURE__ */ jsxs(Typography, { variant: "caption", style: { fontFamily: "monospace" }, children: [
                    "Redirect to: ",
                    log.guardResult.redirect
                  ] })
                ] })
              }
            ),
            log.error && /* @__PURE__ */ jsxs(Alert, { severity: "error", children: [
              /* @__PURE__ */ jsx(Typography, { variant: "body2", style: { fontWeight: 600 }, children: "Error" }),
              /* @__PURE__ */ jsx(Typography, { variant: "caption", children: log.error })
            ] }),
            log.duration !== void 0 && log.duration > 0 && /* @__PURE__ */ jsx(Flex, { justify: "end", style: { marginTop: 4 }, children: /* @__PURE__ */ jsxs(Badge, { color: "default", size: "sm", children: [
              log.duration,
              "ms"
            ] }) })
          ] })
        }
      );
    };
    CompassDevTools = (props) => {
      const config = { ...DEFAULT_CONFIG2, ...props };
      const [isOpen, setIsOpen] = useState(true);
      const [logs, setLogs] = useState([]);
      const [isDark, setIsDark] = useState(config.defaultTheme === "dark");
      const [activeTab, setActiveTab] = useState("logs");
      const CompassContext2 = getCompassContext();
      const contextValue = useContext(CompassContext2);
      const routerFromContext = contextValue?.router;
      const stateFromContext = contextValue?.state;
      const [routerState, setRouterState] = useState(stateFromContext ?? null);
      useEffect(() => {
        if (stateFromContext) {
          setRouterState(stateFromContext);
        }
      }, [stateFromContext]);
      useEffect(() => {
        const router = routerFromContext ?? (typeof window !== "undefined" ? window.__FORGE_COMPASS_ROUTER__ : null);
        if (!router) return;
        router.setDevToolsCallback((log) => {
          setLogs((prev) => [log, ...prev].slice(0, 100));
        });
        let unsubscribe = null;
        if (!routerFromContext) {
          unsubscribe = router.subscribe((state) => {
            setRouterState(state);
          });
          setRouterState(router.getState());
        }
        const currentState = router.getState();
        if (currentState.currentRoute && logs.length === 0) {
          setLogs([{
            id: "initial-" + Date.now(),
            type: "navigate",
            to: currentState.currentRoute.path,
            from: void 0,
            timestamp: Date.now(),
            duration: 0
          }]);
        }
        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
          router.setDevToolsCallback(null);
        };
      }, [routerFromContext, logs.length]);
      if (!config.enabled) return null;
      const isRight = config.position === "right";
      const bgColor = isDark ? "#09090b" : "#ffffff";
      const borderColor = isDark ? "#27272a" : "#e4e4e7";
      const textColor = isDark ? "#fafafa" : "#18181b";
      const mutedColor = isDark ? "#71717a" : "#a1a1aa";
      const headerBg = isDark ? "#0a0a0a" : "#fafafa";
      const successCount = logs.filter((l) => l.type === "navigate").length;
      const guardCount = logs.filter((l) => l.type === "guard").length;
      const errorCount = logs.filter((l) => l.type === "error" || l.type === "guard" && !l.guardResult?.allowed).length;
      const redirectCount = logs.filter((l) => l.type === "redirect").length;
      if (!isOpen) {
        return /* @__PURE__ */ jsx(BearProvider, { defaultMode: isDark ? "dark" : "light", children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "primary",
            onClick: () => setIsOpen(true),
            "aria-label": "Open Compass DevTools",
            style: {
              position: "fixed",
              right: isRight ? 0 : "auto",
              left: !isRight ? 0 : "auto",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: NUMBERS.Z_INDEX,
              width: 40,
              height: 80,
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              border: "none",
              borderRadius: isRight ? "8px 0 0 8px" : "0 8px 8px 0",
              padding: 0,
              minWidth: "auto"
            },
            children: isRight ? /* @__PURE__ */ jsx(ChevronLeftIcon, { size: 20, color: "white" }) : /* @__PURE__ */ jsx(ChevronRightIcon, { size: 20, color: "white" })
          }
        ) });
      }
      return /* @__PURE__ */ jsx(BearProvider, { defaultMode: isDark ? "dark" : "light", children: /* @__PURE__ */ jsxs(
        Box,
        {
          style: {
            position: "fixed",
            right: isRight ? 0 : "auto",
            left: !isRight ? 0 : "auto",
            top: 0,
            bottom: 0,
            width: config.panelWidth,
            zIndex: NUMBERS.Z_INDEX,
            background: bgColor,
            borderLeft: isRight ? `1px solid ${borderColor}` : "none",
            borderRight: !isRight ? `1px solid ${borderColor}` : "none",
            display: "flex",
            flexDirection: "column",
            fontFamily: "system-ui, -apple-system, sans-serif"
          },
          children: [
            /* @__PURE__ */ jsx(Box, { style: { padding: 16, borderBottom: `1px solid ${borderColor}`, background: headerBg }, children: /* @__PURE__ */ jsxs(Flex, { justify: "between", align: "center", children: [
              /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 12, children: [
                /* @__PURE__ */ jsx(
                  Box,
                  {
                    style: {
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18
                    },
                    children: "\u{1F9ED}"
                  }
                ),
                /* @__PURE__ */ jsxs(Box, { children: [
                  /* @__PURE__ */ jsx(Typography, { variant: "h6", style: { color: textColor, fontWeight: 700 }, children: "Compass DevTools" }),
                  /* @__PURE__ */ jsxs(Typography, { variant: "caption", style: { color: mutedColor }, children: [
                    "v",
                    VERSION
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 8, children: [
                /* @__PURE__ */ jsx(
                  Switch,
                  {
                    checked: isDark,
                    onChange: () => setIsDark(!isDark),
                    size: "sm"
                  }
                ),
                /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsOpen(false), children: /* @__PURE__ */ jsx(CloseIcon, { size: 18 }) })
              ] })
            ] }) }),
            routerState?.currentRoute && /* @__PURE__ */ jsx(Box, { style: { padding: 12, borderBottom: `1px solid ${borderColor}` }, children: /* @__PURE__ */ jsx(Card, { style: { background: isDark ? "#18181b" : "#f4f4f5", border: `1px solid ${borderColor}` }, children: /* @__PURE__ */ jsxs(CardBody, { style: { padding: 12 }, children: [
              /* @__PURE__ */ jsx(Typography, { variant: "caption", style: { color: mutedColor, marginBottom: 6, display: "block" }, children: "CURRENT ROUTE" }),
              /* @__PURE__ */ jsx(
                Typography,
                {
                  variant: "h6",
                  style: {
                    color: "#3b82f6",
                    fontFamily: "monospace",
                    fontWeight: 600,
                    wordBreak: "break-all"
                  },
                  children: routerState.currentRoute.path
                }
              ),
              routerState.currentRoute.meta?.title && /* @__PURE__ */ jsx(Badge, { color: "info", size: "sm", style: { marginTop: 8 }, children: routerState.currentRoute.meta.title }),
              Object.keys(routerState.currentRoute.params).length > 0 && /* @__PURE__ */ jsx(Box, { style: { marginTop: 8 }, children: /* @__PURE__ */ jsx(Flex, { gap: 4, style: { flexWrap: "wrap" }, children: Object.entries(routerState.currentRoute.params).map(([key, value]) => /* @__PURE__ */ jsxs(Badge, { color: "default", size: "sm", children: [
                key,
                "=",
                value
              ] }, key)) }) })
            ] }) }) }),
            /* @__PURE__ */ jsx(Box, { style: { padding: 12, borderBottom: `1px solid ${borderColor}` }, children: /* @__PURE__ */ jsxs(Flex, { gap: 8, style: { flexWrap: "wrap" }, children: [
              /* @__PURE__ */ jsxs(Badge, { color: "success", size: "sm", children: [
                "\u2713 ",
                successCount,
                " Success"
              ] }),
              /* @__PURE__ */ jsxs(Badge, { color: "warning", size: "sm", children: [
                "\u26A1 ",
                guardCount,
                " Guards"
              ] }),
              /* @__PURE__ */ jsxs(Badge, { color: "danger", size: "sm", children: [
                "\u2717 ",
                errorCount,
                " Failed"
              ] }),
              /* @__PURE__ */ jsxs(Badge, { color: "info", size: "sm", children: [
                "\u2192 ",
                redirectCount,
                " Redirects"
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(Box, { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: /* @__PURE__ */ jsxs(Tabs, { defaultTab: activeTab, onChange: setActiveTab, children: [
              /* @__PURE__ */ jsxs(TabList, { children: [
                /* @__PURE__ */ jsx(Tab, { id: "logs", children: "Navigation Log" }),
                /* @__PURE__ */ jsx(Tab, { id: "routes", children: "Routes" }),
                /* @__PURE__ */ jsx(Tab, { id: "history", children: "History" })
              ] }),
              /* @__PURE__ */ jsx(TabPanel, { tabId: "logs", children: /* @__PURE__ */ jsx(Box, { style: { height: "calc(100vh - 340px)", overflow: "auto", padding: 12 }, children: logs.length === 0 ? /* @__PURE__ */ jsxs(Box, { style: { textAlign: "center", padding: 40 }, children: [
                /* @__PURE__ */ jsx(Typography, { variant: "h6", style: { color: mutedColor, marginBottom: 8 }, children: "No navigation yet" }),
                /* @__PURE__ */ jsx(Typography, { variant: "body2", style: { color: mutedColor }, children: "Navigate to see logs here" })
              ] }) : /* @__PURE__ */ jsxs(Box, { children: [
                /* @__PURE__ */ jsxs(Flex, { justify: "between", align: "center", style: { marginBottom: 12 }, children: [
                  /* @__PURE__ */ jsxs(Typography, { variant: "caption", style: { color: mutedColor }, children: [
                    logs.length,
                    " events"
                  ] }),
                  /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setLogs([]), children: "Clear" })
                ] }),
                logs.map((log) => /* @__PURE__ */ jsx(LogEntry, { log, isDark }, log.id))
              ] }) }) }),
              /* @__PURE__ */ jsx(TabPanel, { tabId: "routes", children: /* @__PURE__ */ jsxs(Box, { style: { height: "calc(100vh - 340px)", overflow: "auto", padding: 12 }, children: [
                /* @__PURE__ */ jsx(Typography, { variant: "caption", style: { color: mutedColor, marginBottom: 12, display: "block" }, children: "REGISTERED ROUTES" }),
                routerFromContext?.getRoutes().map((route, idx) => /* @__PURE__ */ jsx(
                  Card,
                  {
                    style: {
                      marginBottom: 8,
                      background: isDark ? "#18181b" : "#f4f4f5",
                      border: `1px solid ${borderColor}`
                    },
                    children: /* @__PURE__ */ jsxs(CardBody, { style: { padding: 10 }, children: [
                      /* @__PURE__ */ jsxs(Flex, { justify: "between", align: "center", children: [
                        /* @__PURE__ */ jsx(Typography, { variant: "body2", style: { fontFamily: "monospace", color: textColor }, children: route.path }),
                        route.guards && route.guards.length > 0 && /* @__PURE__ */ jsxs(Badge, { color: "warning", size: "sm", children: [
                          route.guards.length,
                          " guard",
                          route.guards.length > 1 ? "s" : ""
                        ] })
                      ] }),
                      route.name && /* @__PURE__ */ jsxs(Typography, { variant: "caption", style: { color: mutedColor }, children: [
                        "name: ",
                        route.name
                      ] })
                    ] })
                  },
                  idx
                ))
              ] }) }),
              /* @__PURE__ */ jsx(TabPanel, { tabId: "history", children: /* @__PURE__ */ jsxs(Box, { style: { height: "calc(100vh - 340px)", overflow: "auto", padding: 12 }, children: [
                /* @__PURE__ */ jsxs(Typography, { variant: "caption", style: { color: mutedColor, marginBottom: 12, display: "block" }, children: [
                  "NAVIGATION HISTORY (",
                  routerState?.history.length ?? 0,
                  ")"
                ] }),
                routerState?.history.map((entry, idx) => /* @__PURE__ */ jsx(
                  Card,
                  {
                    style: {
                      marginBottom: 8,
                      background: isDark ? "#18181b" : "#f4f4f5",
                      border: `1px solid ${borderColor}`
                    },
                    children: /* @__PURE__ */ jsx(CardBody, { style: { padding: 10 }, children: /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 8, children: [
                      /* @__PURE__ */ jsx(Badge, { color: "default", size: "sm", children: idx + 1 }),
                      /* @__PURE__ */ jsx(Typography, { variant: "body2", style: { fontFamily: "monospace", color: textColor }, children: entry.path })
                    ] }) })
                  },
                  idx
                ))
              ] }) })
            ] }) }),
            /* @__PURE__ */ jsx(Box, { style: { padding: 12, borderTop: `1px solid ${borderColor}`, background: headerBg }, children: /* @__PURE__ */ jsxs(Flex, { justify: "between", align: "center", children: [
              /* @__PURE__ */ jsxs(Typography, { variant: "caption", style: { color: mutedColor }, children: [
                isDark ? "\u{1F319} Dark" : "\u2600\uFE0F Light",
                " Mode"
              ] }),
              /* @__PURE__ */ jsxs(Flex, { gap: 4, children: [
                routerState?.isNavigating && /* @__PURE__ */ jsx(Badge, { color: "warning", size: "sm", children: "Navigating..." }),
                routerState?.error && /* @__PURE__ */ jsx(Badge, { color: "danger", size: "sm", children: "Error" })
              ] })
            ] }) })
          ]
        }
      ) });
    };
  }
});
var CompassContext, LazyDevTools, getCompassContext, CompassProvider, useCompassContext, useRouter, useRoute, useParams, useQuery, useNavigate;
var init_CompassContext = __esm({
  "src/adapters/react/CompassContext.tsx"() {
    init_Router();
    init_ProgressBar();
    init_RouteAnnouncer();
    CompassContext = createContext(null);
    LazyDevTools = lazy(() => Promise.resolve().then(() => (init_CompassDevTools(), CompassDevTools_exports)).then((m) => ({ default: m.CompassDevTools })));
    getCompassContext = () => CompassContext;
    CompassProvider = ({
      children,
      devTools = false,
      devToolsPosition = "right",
      showProgress = false,
      progressColor = "#3b82f6",
      scrollRestoration = "auto",
      announceRoutes = false,
      announceFormat,
      transition,
      transitionDuration,
      ...config
    }) => {
      const [router] = useState(() => createRouter(config));
      const [state, setState] = useState(router.getState());
      const fullConfig = {
        ...config,
        devTools,
        devToolsPosition,
        showProgress,
        progressColor,
        scrollRestoration,
        announceRoutes,
        announceFormat,
        transition,
        transitionDuration
      };
      useEffect(() => {
        const unsubscribe = router.subscribe(setState);
        return () => {
          unsubscribe();
          router.destroy();
        };
      }, [router]);
      const value = useMemo(
        () => ({ router, state, devToolsEnabled: devTools, config: fullConfig }),
        [router, state, devTools, fullConfig]
      );
      return /* @__PURE__ */ jsxs(CompassContext.Provider, { value, children: [
        showProgress && /* @__PURE__ */ jsx(ProgressBar, { color: progressColor }),
        announceRoutes && /* @__PURE__ */ jsx(RouteAnnouncer, { format: announceFormat }),
        children,
        devTools && /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(LazyDevTools, { position: devToolsPosition, showConsoleLog: false }) })
      ] });
    };
    useCompassContext = () => {
      const context = useContext(CompassContext);
      if (!context) {
        throw new Error("useCompassContext must be used within a CompassProvider");
      }
      return context;
    };
    useRouter = () => {
      const { router } = useCompassContext();
      return router;
    };
    useRoute = () => {
      const { state } = useCompassContext();
      return state.currentRoute;
    };
    useParams = () => {
      const route = useRoute();
      return route?.params ?? {};
    };
    useQuery = () => {
      const route = useRoute();
      return route?.query ?? {};
    };
    useNavigate = () => {
      const router = useRouter();
      const navigate = useCallback(
        (to, options) => {
          router.navigate(to, options);
        },
        [router]
      );
      const push = useCallback(
        (to, options) => {
          router.push(to, options);
        },
        [router]
      );
      const replace = useCallback(
        (to, options) => {
          router.replace(to, options);
        },
        [router]
      );
      const back = useCallback(() => router.back(), [router]);
      const forward = useCallback(() => router.forward(), [router]);
      const go = useCallback((delta) => router.go(delta), [router]);
      return useMemo(
        () => ({ navigate, push, replace, back, forward, go }),
        [navigate, push, replace, back, forward, go]
      );
    };
  }
});

// src/core/index.ts
init_Router();

// src/index.ts
init_constants();
init_utils();

// src/utils/routeGroup.ts
var routeGroup = (config) => {
  const { guards, layout, meta, fallback, errorBoundary, children } = config;
  return children.map((child) => ({
    ...child,
    guards: [...guards || [], ...child.guards || []],
    layout: child.layout || layout,
    meta: { ...meta, ...child.meta },
    fallback: child.fallback || fallback,
    errorBoundary: child.errorBoundary || errorBoundary,
    children: child.children?.map((grandChild) => ({
      ...grandChild,
      guards: [...guards || [], ...child.guards || [], ...grandChild.guards || []],
      meta: { ...meta, ...child.meta, ...grandChild.meta },
      fallback: grandChild.fallback || child.fallback || fallback,
      errorBoundary: grandChild.errorBoundary || child.errorBoundary || errorBoundary
    }))
  }));
};
var mergeRouteGroups = (...groups) => {
  return groups.flat();
};
var createRoute = (path, component, options) => ({
  path,
  component,
  ...options
});
var createRedirect = (from, to, options) => ({
  path: from,
  redirect: to,
  ...options
});

// src/guards/index.ts
init_constants();
var createGuard = (name, check, onDeny) => ({
  name,
  check,
  onDeny
});
var authGuard = (isAuthenticated, redirectTo = "/login") => createGuard(
  "auth",
  () => {
    if (isAuthenticated()) {
      return GUARD_RESULTS.ALLOW;
    }
    return { allowed: false, redirect: redirectTo, reason: "Not authenticated" };
  }
);
var roleGuard = (allowedRoles, getCurrentRole, redirectTo = "/unauthorized") => createGuard(
  "role",
  () => {
    const role = getCurrentRole();
    if (role && allowedRoles.includes(role)) {
      return GUARD_RESULTS.ALLOW;
    }
    return {
      allowed: false,
      redirect: redirectTo,
      reason: `Role '${role}' not in allowed roles: ${allowedRoles.join(", ")}`
    };
  }
);
var permissionGuard = (requiredPermissions, getUserPermissions, redirectTo = "/unauthorized") => createGuard(
  "permission",
  () => {
    const permissions = getUserPermissions();
    const hasAll = requiredPermissions.every((p) => permissions.includes(p));
    if (hasAll) {
      return GUARD_RESULTS.ALLOW;
    }
    const missing = requiredPermissions.filter((p) => !permissions.includes(p));
    return {
      allowed: false,
      redirect: redirectTo,
      reason: `Missing permissions: ${missing.join(", ")}`
    };
  }
);
var conditionalGuard = (name, condition, redirectTo, reason) => createGuard(
  name,
  (context) => {
    if (condition(context)) {
      return GUARD_RESULTS.ALLOW;
    }
    return { allowed: false, redirect: redirectTo, reason };
  }
);
var featureGuard = (featureName, isFeatureEnabled, redirectTo = "/not-found") => createGuard(
  `feature:${featureName}`,
  () => {
    if (isFeatureEnabled(featureName)) {
      return GUARD_RESULTS.ALLOW;
    }
    return {
      allowed: false,
      redirect: redirectTo,
      reason: `Feature '${featureName}' is not enabled`
    };
  }
);
var rateLimitGuard = (maxAttempts, windowMs, keyFn = (ctx) => ctx.path) => {
  const attempts = /* @__PURE__ */ new Map();
  return createGuard(
    "rateLimit",
    (context) => {
      const key = keyFn(context);
      const now = Date.now();
      const entry = attempts.get(key);
      if (!entry || now > entry.resetAt) {
        attempts.set(key, { count: 1, resetAt: now + windowMs });
        return GUARD_RESULTS.ALLOW;
      }
      if (entry.count >= maxAttempts) {
        return {
          allowed: false,
          reason: `Rate limit exceeded. Try again in ${Math.ceil((entry.resetAt - now) / 1e3)}s`
        };
      }
      entry.count++;
      return GUARD_RESULTS.ALLOW;
    }
  );
};
var combineGuards = (guards, name = "combined") => createGuard(
  name,
  async (context) => {
    for (const guard of guards) {
      const result = await Promise.resolve(guard.check(context));
      if (!result.allowed) {
        return result;
      }
    }
    return GUARD_RESULTS.ALLOW;
  }
);
var anyGuard = (guards, name = "any") => createGuard(
  name,
  async (context) => {
    const results = [];
    for (const guard of guards) {
      const result = await Promise.resolve(guard.check(context));
      if (result.allowed) {
        return GUARD_RESULTS.ALLOW;
      }
      results.push(result);
    }
    const lastResult = results[results.length - 1];
    return lastResult ?? GUARD_RESULTS.DENY;
  }
);
var notGuard = (guard, name) => createGuard(
  name ?? `not:${guard.name}`,
  async (context) => {
    const result = await Promise.resolve(guard.check(context));
    return result.allowed ? GUARD_RESULTS.DENY : GUARD_RESULTS.ALLOW;
  }
);

// src/adapters/react/index.ts
init_CompassContext();

// src/adapters/react/Routes.tsx
init_CompassContext();
init_utils();

// src/adapters/react/Route.tsx
var Route = (_props) => {
  return null;
};
var routeFromProps = (props) => ({
  path: props.path,
  name: props.name,
  component: props.component,
  element: props.element,
  guards: props.guards,
  meta: props.meta,
  redirect: props.redirect,
  index: props.index,
  layout: props.layout,
  fallback: props.fallback
});
var extractRoutesFromChildren = (children) => {
  const routes2 = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const props = child.props;
    const route = routeFromProps(props);
    if (props.children) {
      route.children = extractRoutesFromChildren(props.children);
    }
    routes2.push(route);
  });
  return routes2;
};
var Routes = ({ children, fallback }) => {
  const { router, state } = useCompassContext();
  const childRoutesRef = useRef([]);
  const hasRegistered = useRef(false);
  useEffect(() => {
    if (children && !hasRegistered.current) {
      const childRoutes = extractRoutesFromChildren(children);
      if (childRoutes.length > 0) {
        childRoutesRef.current = childRoutes;
        childRoutes.forEach((route) => {
          router.addRoute(route);
        });
        hasRegistered.current = true;
      }
    }
  }, [children, router]);
  if (state.error) {
    return /* @__PURE__ */ jsxs("div", { children: [
      "Error: ",
      state.error.message
    ] });
  }
  if (!state.currentRoute) {
    return fallback ? /* @__PURE__ */ jsx(Fragment, { children: fallback }) : null;
  }
  const currentRoute = state.currentRoute;
  const routes2 = router.getRoutes();
  const match = matchRoute(routes2, currentRoute.path);
  if (!match) {
    const notFound = routes2.find((r) => r.path === "*");
    if (notFound?.component) {
      const NotFoundComponent = notFound.component;
      return /* @__PURE__ */ jsx(Suspense, { fallback: fallback || /* @__PURE__ */ jsx("div", { children: "Loading..." }), children: /* @__PURE__ */ jsx(NotFoundComponent, { route: currentRoute }) });
    }
    return /* @__PURE__ */ jsx("div", { children: "404 - Page Not Found" });
  }
  const renderRoute = (route, index) => {
    if (route.element) {
      return /* @__PURE__ */ jsx(Suspense, { fallback: route.fallback || fallback || /* @__PURE__ */ jsx("div", { children: "Loading..." }), children: route.element }, index);
    }
    if (route.component) {
      const Component2 = route.component;
      return /* @__PURE__ */ jsx(Suspense, { fallback: route.fallback || fallback || /* @__PURE__ */ jsx("div", { children: "Loading..." }), children: /* @__PURE__ */ jsx(Component2, { route: currentRoute, children: route.children && route.children.map(renderRoute) }) }, index);
    }
    return null;
  };
  const matchedRoutes = match.matched;
  if (matchedRoutes.length === 0) {
    return null;
  }
  let result = null;
  for (let i = matchedRoutes.length - 1; i >= 0; i--) {
    const route = matchedRoutes[i];
    if (route.layout) {
      const Layout = route.layout;
      result = /* @__PURE__ */ jsx(Suspense, { fallback: route.fallback || fallback || /* @__PURE__ */ jsx("div", { children: "Loading..." }), children: /* @__PURE__ */ jsx(Layout, { route: currentRoute, children: result || renderRoute(route, i) }) });
    } else if (!result) {
      result = renderRoute(route, i);
    }
  }
  return result;
};

// src/adapters/react/Link.tsx
init_CompassContext();
var Link = ({
  to,
  replace = false,
  state,
  children,
  onClick,
  prefetch,
  ...rest
}) => {
  const router = useRouter();
  const handleClick = useCallback(
    (e) => {
      if (onClick) {
        onClick(e);
      }
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
      if (rest.target === "_blank") return;
      e.preventDefault();
      router.navigate(to, { replace, state });
    },
    [router, to, replace, state, onClick, rest.target]
  );
  const href = useMemo(() => {
    return to.startsWith("/") ? to : `/${to}`;
  }, [to]);
  return /* @__PURE__ */ jsx("a", { href, onClick: handleClick, ...rest, children });
};
init_CompassContext();
var NavLink = ({
  to,
  className,
  activeClassName = "active",
  exactActiveClassName = "exact-active",
  exact = false,
  ...rest
}) => {
  const route = useRoute();
  const { isActive, isExactActive } = useMemo(() => {
    if (!route) return { isActive: false, isExactActive: false };
    const currentPath = route.path;
    const targetPath = to.startsWith("/") ? to : `/${to}`;
    const exactMatch = currentPath === targetPath;
    const prefixMatch = currentPath.startsWith(targetPath);
    return {
      isActive: prefixMatch,
      isExactActive: exactMatch
    };
  }, [route, to]);
  const computedClassName = useMemo(() => {
    const classes = [];
    if (className) {
      classes.push(typeof className === "string" ? className : "");
    }
    if (isActive && !exact) {
      classes.push(activeClassName);
    }
    if (isExactActive) {
      classes.push(exactActiveClassName);
    }
    return classes.filter(Boolean).join(" ");
  }, [className, isActive, isExactActive, activeClassName, exactActiveClassName, exact]);
  return /* @__PURE__ */ jsx(Link, { to, className: computedClassName, ...rest });
};

// src/adapters/react/Navigate.tsx
init_CompassContext();
var Navigate = ({ to, replace = false, state }) => {
  const { navigate } = useNavigate();
  useEffect(() => {
    navigate(to, { replace, state });
  }, [navigate, to, replace, state]);
  return null;
};

// src/adapters/react/Outlet.tsx
init_CompassContext();
init_utils();
var Outlet = ({ fallback }) => {
  const { router } = useCompassContext();
  const route = useRoute();
  if (!route) return null;
  const routes2 = router.getRoutes();
  const match = matchRoute(routes2, route.path);
  if (!match || match.matched.length < 2) {
    return null;
  }
  const childRoute = match.matched[match.matched.length - 1];
  if (childRoute.element) {
    return /* @__PURE__ */ jsx(Suspense, { fallback: fallback || /* @__PURE__ */ jsx("div", { children: "Loading..." }), children: childRoute.element });
  }
  if (childRoute.component) {
    const Component2 = childRoute.component;
    return /* @__PURE__ */ jsx(Suspense, { fallback: fallback || /* @__PURE__ */ jsx("div", { children: "Loading..." }), children: /* @__PURE__ */ jsx(Component2, { route }) });
  }
  return null;
};

// src/adapters/react/useGuard.ts
init_CompassContext();
var useGuard = (guard) => {
  const route = useRoute();
  const [isChecking, setIsChecking] = useState(true);
  const [result, setResult] = useState(null);
  const checkGuard = useCallback(async () => {
    if (!route) {
      setResult({ allowed: false, reason: "No route context" });
      setIsChecking(false);
      return;
    }
    setIsChecking(true);
    try {
      const guardResult = await Promise.resolve(guard.check(route));
      setResult(guardResult);
    } catch (error) {
      setResult({ allowed: false, reason: String(error) });
    } finally {
      setIsChecking(false);
    }
  }, [guard, route]);
  useEffect(() => {
    checkGuard();
  }, [checkGuard]);
  return {
    isChecking,
    isAllowed: result?.allowed ?? false,
    result,
    recheck: checkGuard
  };
};

// src/adapters/react/useBreadcrumbs.ts
init_CompassContext();
init_utils();
var useBreadcrumbs = () => {
  const { router } = useCompassContext();
  const route = useRoute();
  return useMemo(() => {
    if (!route) return [];
    const routes2 = router.getRoutes();
    const match = matchRoute(routes2, route.path);
    if (!match) return [];
    const breadcrumbs = [];
    let currentPath = "";
    for (const matchedRoute of match.matched) {
      currentPath = joinPaths(currentPath, matchedRoute.path);
      const name = matchedRoute.meta?.title ?? matchedRoute.name ?? matchedRoute.path;
      const isActive = currentPath === route.path;
      breadcrumbs.push({
        name,
        path: currentPath,
        meta: matchedRoute.meta,
        isActive
      });
    }
    return breadcrumbs;
  }, [router, route]);
};

// src/adapters/react/useRouteMatch.ts
init_CompassContext();
init_utils();
var useRouteMatch = (pattern) => {
  const route = useRoute();
  return useMemo(() => {
    if (!route) {
      return { matched: false, params: {} };
    }
    const { matched, params } = matchPath(pattern, route.path);
    return { matched, params };
  }, [route, pattern]);
};
var useBlocker = (shouldBlock, message) => {
  const [isBlocking, setIsBlocking] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const blockerRef = useRef(null);
  const messageRef = useRef(message);
  const block = useCallback((msgOrFn) => {
    if (typeof msgOrFn === "function") {
      blockerRef.current = msgOrFn;
    } else {
      messageRef.current = msgOrFn;
      blockerRef.current = () => true;
    }
    setIsBlocking(true);
  }, []);
  const unblock = useCallback(() => {
    blockerRef.current = null;
    setIsBlocking(false);
  }, []);
  const proceed = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation.resolve(true);
      setPendingNavigation(null);
    }
  }, [pendingNavigation]);
  const cancel = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation.resolve(false);
      setPendingNavigation(null);
    }
  }, [pendingNavigation]);
  useEffect(() => {
    if (shouldBlock !== void 0) {
      if (typeof shouldBlock === "function") {
        blockerRef.current = shouldBlock;
        setIsBlocking(true);
      } else if (shouldBlock) {
        blockerRef.current = () => true;
        messageRef.current = message;
        setIsBlocking(true);
      } else {
        blockerRef.current = null;
        setIsBlocking(false);
      }
    }
  }, [shouldBlock, message]);
  useEffect(() => {
    if (!isBlocking) return;
    const handleBeforeUnload = (e) => {
      if (blockerRef.current) {
        e.preventDefault();
        e.returnValue = messageRef.current || "";
        return messageRef.current || "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isBlocking]);
  const state = {
    isBlocked: pendingNavigation !== null,
    proceed,
    cancel,
    message: messageRef.current
  };
  return {
    state,
    block,
    unblock,
    isBlocking
  };
};

// src/adapters/react/useQueryState.ts
init_CompassContext();
var useQueryState = (options = {}) => {
  const router = useRouter();
  const route = useRoute();
  const { defaultValue = {}, replace = true } = options;
  const parseQuery = useCallback(() => {
    const result = { ...defaultValue };
    if (route?.query) {
      Object.entries(route.query).forEach(([key, value]) => {
        if (value !== void 0) {
          if (key in defaultValue) {
            const defaultVal = defaultValue[key];
            if (typeof defaultVal === "number") {
              result[key] = Number(value);
            } else if (typeof defaultVal === "boolean") {
              result[key] = value === "true";
            } else {
              result[key] = value;
            }
          } else {
            result[key] = value;
          }
        }
      });
    }
    return result;
  }, [route?.query, defaultValue]);
  const [state, setState] = useState(parseQuery);
  useEffect(() => {
    setState(parseQuery());
  }, [parseQuery]);
  const setQuery = useCallback((updates) => {
    const newState = { ...state, ...updates };
    setState(newState);
    const queryParts = [];
    Object.entries(newState).forEach(([key, value]) => {
      if (value !== null && value !== void 0 && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
          });
        } else {
          queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
        }
      }
    });
    const newSearch = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    const newPath = (route?.path.split("?")[0] || "/") + newSearch;
    router.navigate(newPath, { replace });
  }, [state, route?.path, router, replace]);
  const resetQuery = useCallback(() => {
    setState(defaultValue);
    const basePath = route?.path.split("?")[0] || "/";
    router.navigate(basePath, { replace });
  }, [defaultValue, route?.path, router, replace]);
  return [state, setQuery, resetQuery];
};
var useQueryParam = (key, defaultValue) => {
  const router = useRouter();
  const route = useRoute();
  const value = useMemo(() => {
    const queryValue = route?.query[key];
    if (queryValue === void 0) return defaultValue;
    if (typeof defaultValue === "number") {
      return Number(queryValue);
    }
    if (typeof defaultValue === "boolean") {
      return queryValue === "true";
    }
    return queryValue;
  }, [route?.query, key, defaultValue]);
  const setValue = useCallback((newValue) => {
    const currentQuery = route?.query || {};
    const newQuery = { ...currentQuery };
    if (newValue === void 0 || newValue === null) {
      delete newQuery[key];
    } else {
      newQuery[key] = String(newValue);
    }
    const queryParts = [];
    Object.entries(newQuery).forEach(([k, v]) => {
      if (v !== void 0) {
        if (Array.isArray(v)) {
          v.forEach((val) => {
            queryParts.push(`${encodeURIComponent(k)}=${encodeURIComponent(val)}`);
          });
        } else {
          queryParts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
        }
      }
    });
    const newSearch = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
    const basePath = route?.path.split("?")[0] || "/";
    router.navigate(basePath + newSearch, { replace: true });
  }, [route?.query, route?.path, router, key]);
  return [value, setValue];
};

// src/adapters/react/usePrefetch.ts
init_CompassContext();
var prefetchedRoutes = /* @__PURE__ */ new Set();
var usePrefetch = (options = {}) => {
  const router = useRouter();
  const { delay = 100 } = options;
  const timeoutRef = useRef(null);
  const prefetch = useCallback((path) => {
    if (prefetchedRoutes.has(path)) return;
    prefetchedRoutes.add(path);
    const routes2 = router.getRoutes();
    const matchRoute2 = (routes3, targetPath) => {
      for (const route2 of routes3) {
        if (route2.path === targetPath || route2.path === targetPath.split("?")[0]) {
          return route2;
        }
        if (route2.children) {
          const child = matchRoute2(route2.children, targetPath);
          if (child) return child;
        }
      }
      return null;
    };
    const route = matchRoute2(routes2, path);
    if (route?.component && "preload" in route.component) {
      route.component.preload?.();
    }
  }, [router]);
  const prefetchOnHover = useCallback((path) => {
    return {
      onMouseEnter: () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => prefetch(path), delay);
      },
      onFocus: () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => prefetch(path), delay);
      }
    };
  }, [prefetch, delay]);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  return { prefetch, prefetchOnHover };
};
var useIntersectionPrefetch = (paths, options = {}) => {
  const ref = useRef(null);
  const { prefetch } = usePrefetch();
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            paths.forEach(prefetch);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, ...options }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [paths, prefetch, options]);
  return ref;
};

// src/adapters/react/useScrollRestoration.ts
init_CompassContext();
var scrollPositions = /* @__PURE__ */ new Map();
var useScrollRestoration = (mode = "auto") => {
  const route = useRoute();
  const previousPathRef = useRef(null);
  const savePosition = useCallback(() => {
    if (!route?.path) return;
    scrollPositions.set(route.path, {
      x: window.scrollX,
      y: window.scrollY
    });
  }, [route?.path]);
  const restorePosition = useCallback(() => {
    if (!route?.path) return;
    const position = scrollPositions.get(route.path);
    if (position) {
      window.scrollTo(position.x, position.y);
    }
  }, [route?.path]);
  const scrollTo = useCallback((position) => {
    window.scrollTo(position.x, position.y);
  }, []);
  const scrollToTop2 = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  useEffect(() => {
    if (mode === "disabled") return;
    if (!route?.path) return;
    if (previousPathRef.current && previousPathRef.current !== route.path) {
      scrollPositions.set(previousPathRef.current, {
        x: window.scrollX,
        y: window.scrollY
      });
    }
    previousPathRef.current = route.path;
    if (mode === "auto") {
      const savedPosition = scrollPositions.get(route.path);
      if (savedPosition) {
        requestAnimationFrame(() => {
          window.scrollTo(savedPosition.x, savedPosition.y);
        });
      } else {
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
      }
    }
  }, [route?.path, mode]);
  useEffect(() => {
    if (mode === "disabled") return;
    const handlePopState = () => {
      if (route?.path) {
        const position = scrollPositions.get(route.path);
        if (position) {
          requestAnimationFrame(() => {
            window.scrollTo(position.x, position.y);
          });
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [route?.path, mode]);
  return {
    savePosition,
    restorePosition,
    scrollTo,
    scrollToTop: scrollToTop2
  };
};

// src/adapters/react/useFocus.ts
init_CompassContext();
var useFocus = (autoFocus) => {
  const route = useRoute();
  const previousPathRef = useRef(null);
  const focusElement = useCallback((selector) => {
    requestAnimationFrame(() => {
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute("tabindex", "-1");
        element.focus({ preventScroll: true });
      }
    });
  }, []);
  const setFocus = useCallback((target) => {
    switch (target) {
      case "heading":
        focusElement('h1, [role="heading"]');
        break;
      case "first-input":
        focusElement('input:not([type="hidden"]), textarea, select, [contenteditable="true"]');
        break;
      case "main":
        focusElement('main, [role="main"], #main');
        break;
      default:
        if (target.startsWith("#") || target.startsWith(".") || target.startsWith("[")) {
          focusElement(target);
        }
        break;
    }
  }, [focusElement]);
  const focusMain = useCallback(() => setFocus("main"), [setFocus]);
  const focusHeading = useCallback(() => setFocus("heading"), [setFocus]);
  const focusFirstInput = useCallback(() => setFocus("first-input"), [setFocus]);
  useEffect(() => {
    if (!autoFocus || !route?.path) return;
    if (previousPathRef.current !== route.path) {
      previousPathRef.current = route.path;
      setFocus(autoFocus);
    }
  }, [route?.path, autoFocus, setFocus]);
  return {
    setFocus,
    focusMain,
    focusHeading,
    focusFirstInput
  };
};

// src/adapters/react/index.ts
init_ProgressBar();
init_RouteAnnouncer();

// src/adapters/react/Transition.tsx
init_CompassContext();
var TRANSITION_STYLES = {
  fade: {
    enter: "opacity: 0;",
    exit: "opacity: 1;"
  },
  slide: {
    enter: "opacity: 0; transform: translateX(20px);",
    exit: "opacity: 1; transform: translateX(0);"
  },
  none: {
    enter: "",
    exit: ""
  }
};
var Transition = ({
  children,
  type = "fade",
  duration = 200,
  className
}) => {
  const route = useRoute();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState("exit");
  const previousPathRef = useRef(null);
  const getStyles = () => {
    if (typeof type === "object") {
      return type;
    }
    return TRANSITION_STYLES[type] || TRANSITION_STYLES.none;
  };
  const styles = getStyles();
  const transitionDuration = typeof type === "object" ? type.duration || duration : duration;
  useEffect(() => {
    if (!route?.path) return;
    if (previousPathRef.current !== null && previousPathRef.current !== route.path) {
      setIsTransitioning(true);
      setPhase("enter");
      const exitTimer = setTimeout(() => {
        setDisplayChildren(children);
        setPhase("exit");
      }, transitionDuration / 2);
      const completeTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration);
      previousPathRef.current = route.path;
      return () => {
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    } else {
      previousPathRef.current = route.path;
      setDisplayChildren(children);
    }
  }, [route?.path, children, transitionDuration]);
  const currentStyle = phase === "enter" ? styles.enter : styles.exit;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className,
      style: {
        transition: `all ${transitionDuration}ms ease-out`,
        ...isTransitioning ? parseStyleString(currentStyle) : {}
      },
      children: displayChildren
    }
  );
};
var parseStyleString = (styleString) => {
  const styles = {};
  styleString.split(";").forEach((rule) => {
    const [property, value] = rule.split(":").map((s) => s.trim());
    if (property && value) {
      const camelCase = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styles[camelCase] = value;
    }
  });
  return styles;
};
var RouteErrorBoundary = class extends Component {
  constructor(props) {
    super(props);
    this.resetError = () => {
      this.setState({ hasError: false, error: null });
    };
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.props.onError?.(error, errorInfo);
  }
  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      if (FallbackComponent) {
        return /* @__PURE__ */ jsx(FallbackComponent, { error: this.state.error, resetError: this.resetError });
      }
      return /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            padding: 24,
            background: "#18181b",
            border: "1px solid #ef4444",
            borderRadius: 8,
            color: "#fafafa",
            fontFamily: "system-ui, -apple-system, sans-serif"
          },
          children: [
            /* @__PURE__ */ jsx("h2", { style: { color: "#ef4444", marginBottom: 16 }, children: "Something went wrong" }),
            /* @__PURE__ */ jsx(
              "pre",
              {
                style: {
                  background: "#09090b",
                  padding: 16,
                  borderRadius: 4,
                  overflow: "auto",
                  fontSize: 14,
                  color: "#a1a1aa"
                },
                children: this.state.error.message
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: this.resetError,
                style: {
                  marginTop: 16,
                  padding: "8px 16px",
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer"
                },
                children: "Try Again"
              }
            )
          ]
        }
      );
    }
    return this.props.children;
  }
};

// src/adapters/react/useLoaderData.ts
init_CompassContext();
var useLoaderData = (loader, options = {}) => {
  const route = useRoute();
  const {
    revalidateOnFocus = false,
    revalidateOnReconnect = false,
    staleTime = 0
  } = options;
  const [state, setState] = useState({
    data: void 0,
    isLoading: true,
    error: null,
    isStale: false
  });
  const abortControllerRef = useRef(null);
  const lastLoadTimeRef = useRef(0);
  const load = useCallback(async () => {
    if (!route || !loader) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const context = {
      params: route.params,
      query: route.query,
      request: new Request(window.location.href),
      signal: abortControllerRef.current.signal
    };
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await Promise.resolve(loader(context));
      lastLoadTimeRef.current = Date.now();
      setState({ data, isLoading: false, error: null, isStale: false });
    } catch (error) {
      if (error.name !== "AbortError") {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error
        }));
      }
    }
  }, [route, loader]);
  const revalidate = useCallback(() => {
    load();
  }, [load]);
  useEffect(() => {
    load();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [load]);
  useEffect(() => {
    if (!revalidateOnFocus) return;
    const handleFocus = () => {
      const now = Date.now();
      if (now - lastLoadTimeRef.current > staleTime) {
        setState((prev) => ({ ...prev, isStale: true }));
        revalidate();
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [revalidateOnFocus, staleTime, revalidate]);
  useEffect(() => {
    if (!revalidateOnReconnect) return;
    const handleOnline = () => {
      revalidate();
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [revalidateOnReconnect, revalidate]);
  return { ...state, revalidate };
};
var createLoader = (loader) => loader;

// src/adapters/react/useAction.ts
init_CompassContext();
var useAction = (action, options = {}) => {
  const route = useRoute();
  const { navigate } = useNavigate();
  const { onSuccess, onError, redirectTo } = options;
  const [state, setState] = useState({
    data: void 0,
    error: void 0,
    status: "idle"
  });
  const abortControllerRef = useRef(null);
  const submit = useCallback(
    async (formDataOrEvent) => {
      if (!route || !action) return;
      let formData;
      if (formDataOrEvent instanceof FormData) {
        formData = formDataOrEvent;
      } else if (formDataOrEvent && "preventDefault" in formDataOrEvent) {
        formDataOrEvent.preventDefault();
        const form = formDataOrEvent.target;
        formData = new FormData(form);
      } else {
        formData = new FormData();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const context = {
        params: route.params,
        request: new Request(window.location.href, {
          method: "POST",
          body: formData
        }),
        formData
      };
      setState({ data: void 0, error: void 0, status: "submitting" });
      try {
        const data = await Promise.resolve(action(context));
        setState({ data, error: void 0, status: "success" });
        onSuccess?.(data);
        if (redirectTo) {
          navigate(redirectTo);
        }
      } catch (error) {
        setState({ data: void 0, error, status: "error" });
        onError?.(error);
      }
    },
    [route, action, onSuccess, onError, redirectTo, navigate]
  );
  const reset = useCallback(() => {
    setState({ data: void 0, error: void 0, status: "idle" });
  }, []);
  return {
    ...state,
    submit,
    reset,
    isSubmitting: state.status === "submitting"
  };
};
var createAction = (action) => action;

// src/adapters/react/useNavigation.ts
init_CompassContext();
var useNavigation = () => {
  const { state } = useCompassContext();
  return useMemo(() => {
    const navigationState = {
      state: state.isNavigating ? "loading" : "idle",
      location: state.currentRoute || void 0
    };
    return {
      ...navigationState,
      isIdle: !state.isNavigating && !state.isLoading,
      isLoading: state.isNavigating || state.isLoading,
      isSubmitting: false
    };
  }, [state.isNavigating, state.isLoading, state.currentRoute]);
};
var usePendingLocation = () => {
  const { state } = useCompassContext();
  return state.isNavigating ? state.currentRoute : null;
};

// src/adapters/react/useViewTransition.tsx
init_CompassContext();
var useViewTransition = (options = {}) => {
  const { enabled = true } = options;
  const isTransitioningRef = useRef(false);
  const isSupported = typeof document !== "undefined" && "startViewTransition" in document;
  const startTransition = useCallback(
    async (callback) => {
      const doc = document;
      if (!isSupported || !enabled || !doc.startViewTransition) {
        await callback();
        return;
      }
      isTransitioningRef.current = true;
      try {
        const transition = doc.startViewTransition(callback);
        await transition.finished;
      } finally {
        isTransitioningRef.current = false;
      }
    },
    [isSupported, enabled]
  );
  return {
    isSupported,
    isTransitioning: isTransitioningRef.current,
    startTransition
  };
};
var ViewTransitionLink = ({
  to,
  children,
  viewTransitionName,
  ...props
}) => {
  const { router } = useCompassContext();
  const { startTransition, isSupported } = useViewTransition();
  const handleClick = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSupported) {
        await startTransition(() => {
          router.navigate(to);
        });
      } else {
        router.navigate(to);
      }
    },
    [router, to, startTransition, isSupported]
  );
  return /* @__PURE__ */ jsx(
    "a",
    {
      href: to,
      onClick: handleClick,
      style: viewTransitionName ? { viewTransitionName, ...props.style } : props.style,
      ...props,
      children
    }
  );
};

// src/adapters/react/useMiddleware.ts
init_CompassContext();
var registerMiddleware = (middleware) => {
  return () => {
  };
};
var clearMiddleware = () => {
};
var runMiddleware = async (middleware, context) => {
  let index = 0;
  const next = async () => {
    if (index < middleware.length) {
      const fn = middleware[index++];
      await fn(context, next);
    }
  };
  await next();
};
var useMiddleware = (middleware) => {
  const { state } = useCompassContext();
  const prevRouteRef = useRef(state.currentRoute);
  useEffect(() => {
    if (state.currentRoute && prevRouteRef.current !== state.currentRoute) {
      const context = {
        to: state.currentRoute,
        from: prevRouteRef.current,
        params: state.currentRoute.params,
        query: state.currentRoute.query
      };
      middleware(context, () => {
      });
      prevRouteRef.current = state.currentRoute;
    }
  }, [state.currentRoute, middleware]);
};
var createMiddleware = (_name, handler) => {
  const middleware = async (context, next) => {
    await handler(context);
    await next();
  };
  return middleware;
};
var loggerMiddleware = async (context, next) => {
  const start = performance.now();
  await next();
  const duration = performance.now() - start;
  if (typeof window !== "undefined" && window.__COMPASS_DEBUG__) {
    console.log(`[Compass] ${context.from?.path || "/"} \u2192 ${context.to.path} (${duration.toFixed(2)}ms)`);
  }
};
var analyticsMiddleware = (trackPageView) => {
  return async (context, next) => {
    await next();
    trackPageView(context.to.path, context.params);
  };
};

// src/adapters/react/useRouteSearch.ts
init_CompassContext();
var flattenRoutes2 = (routes2, parentPath = "") => {
  return routes2.reduce((acc, route) => {
    const fullPath = parentPath + route.path;
    acc.push({ ...route, path: fullPath });
    if (route.children) {
      acc.push(...flattenRoutes2(route.children, fullPath));
    }
    return acc;
  }, []);
};
var fuzzyMatch = (text, query) => {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  const matches = [];
  let score = 0;
  if (textLower === queryLower) {
    return { score: 100, matches: [text] };
  }
  if (textLower.includes(queryLower)) {
    score = 80;
    matches.push(text);
  }
  if (textLower.startsWith(queryLower)) {
    score = 90;
    matches.push(text);
  }
  const words = textLower.split(/[\s\-_\/]+/);
  for (const word of words) {
    if (word.startsWith(queryLower)) {
      score = Math.max(score, 70);
      matches.push(word);
    }
  }
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }
  if (queryIndex === queryLower.length) {
    score = Math.max(score, 50);
  }
  return { score, matches };
};
var useRouteSearch = () => {
  const router = useRouter();
  const allRoutes = useMemo(() => router.getRoutes(), [router]);
  const flatRoutes = useMemo(() => flattenRoutes2(allRoutes), [allRoutes]);
  const searchRoutes = useCallback(
    (query) => {
      if (!query.trim()) {
        return flatRoutes.map((route) => ({
          route,
          score: 0,
          matches: []
        }));
      }
      const results = [];
      for (const route of flatRoutes) {
        const pathMatch = fuzzyMatch(route.path, query);
        const nameMatch = route.name ? fuzzyMatch(route.name, query) : { score: 0, matches: [] };
        const titleMatch = route.meta?.title ? fuzzyMatch(route.meta.title, query) : { score: 0, matches: [] };
        const bestScore = Math.max(pathMatch.score, nameMatch.score, titleMatch.score);
        if (bestScore > 0) {
          results.push({
            route,
            score: bestScore,
            matches: [.../* @__PURE__ */ new Set([...pathMatch.matches, ...nameMatch.matches, ...titleMatch.matches])]
          });
        }
      }
      return results.sort((a, b) => b.score - a.score);
    },
    [flatRoutes]
  );
  return {
    searchRoutes,
    allRoutes,
    flatRoutes
  };
};
var CommandPalette = ({
  isOpen,
  onClose: _onClose,
  onSelect: _onSelect
}) => {
  if (!isOpen) return null;
  return null;
};
var ParallelRoutesContext = createContext(null);
var ParallelRoutesProvider = ({
  children
}) => {
  const [state, setState] = useState({ slots: {} });
  const openSlot = useCallback((slot, route) => {
    setState((prev) => ({
      slots: { ...prev.slots, [slot]: route }
    }));
  }, []);
  const closeSlot = useCallback((slot) => {
    setState((prev) => {
      const { [slot]: _, ...rest } = prev.slots;
      return { slots: rest };
    });
  }, []);
  const isSlotOpen = useCallback(
    (slot) => {
      return !!state.slots[slot];
    },
    [state.slots]
  );
  const value = useMemo(
    () => ({ state, openSlot, closeSlot, isSlotOpen }),
    [state, openSlot, closeSlot, isSlotOpen]
  );
  return /* @__PURE__ */ jsx(ParallelRoutesContext.Provider, { value, children });
};
var useParallelRoutes = () => {
  const context = useContext(ParallelRoutesContext);
  if (!context) {
    throw new Error("useParallelRoutes must be used within ParallelRoutesProvider");
  }
  return context;
};
var ParallelOutlet = ({
  name,
  fallback
}) => {
  const { state } = useParallelRoutes();
  const slot = state.slots[name];
  if (!slot) {
    return fallback ? /* @__PURE__ */ jsx(Fragment, { children: fallback }) : null;
  }
  return null;
};
var useSlot = (name) => {
  const { state, openSlot, closeSlot, isSlotOpen } = useParallelRoutes();
  return {
    route: state.slots[name],
    isOpen: isSlotOpen(name),
    open: (route) => openSlot(name, route),
    close: () => closeSlot(name)
  };
};

// src/adapters/react/InterceptingRoute.tsx
init_CompassContext();
var InterceptingRoute = ({
  pattern,
  interceptFrom,
  modalComponent: ModalComponent,
  pageComponent: PageComponent
}) => {
  const route = useRoute();
  const router = useRouter();
  const { back } = useNavigate();
  const [interceptedRoute, setInterceptedRoute] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const matchesPattern = useCallback(
    (path) => {
      const patternParts = pattern.split("/").filter(Boolean);
      const pathParts = path.split("/").filter(Boolean);
      if (patternParts.length !== pathParts.length) return false;
      return patternParts.every((part, i) => {
        if (part.startsWith(":")) return true;
        return part === pathParts[i];
      });
    },
    [pattern]
  );
  useEffect(() => {
    if (!route) return;
    const state = router.getState();
    const previousRoute = state.previousRoute;
    if (matchesPattern(route.path)) {
      const shouldIntercept = !interceptFrom || interceptFrom.length === 0 || previousRoute && interceptFrom.some((from) => previousRoute.path.startsWith(from));
      if (shouldIntercept && previousRoute) {
        setInterceptedRoute(route);
        setShowModal(true);
      } else {
        setInterceptedRoute(null);
        setShowModal(false);
      }
    } else {
      setInterceptedRoute(null);
      setShowModal(false);
    }
  }, [route, pattern, interceptFrom, matchesPattern, router]);
  const handleClose = useCallback(() => {
    setShowModal(false);
    back();
  }, [back]);
  if (showModal && interceptedRoute) {
    return /* @__PURE__ */ jsx(ModalComponent, { route: interceptedRoute, onClose: handleClose });
  }
  if (route && matchesPattern(route.path)) {
    return /* @__PURE__ */ jsx(PageComponent, { route });
  }
  return null;
};
var useInterceptedRoute = () => {
  const router = useRouter();
  const route = useRoute();
  const state = router.getState();
  return {
    isIntercepted: !!state.previousRoute && route !== null,
    previousRoute: state.previousRoute,
    currentRoute: route
  };
};

// src/adapters/react/TypedParams.ts
init_CompassContext();
var useTypedParams = () => {
  const route = useRoute();
  return route?.params ?? {};
};
var useTypedQuery = () => {
  const route = useRoute();
  return route?.query ?? {};
};
var defineRoute = (path) => {
  return {
    path,
    params: {}
  };
};
var buildTypedPath = (path, params) => {
  let result = path;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, String(value));
  }
  return result;
};
var createTypedRoute = (path) => {
  return {
    path,
    getPath: (params) => buildTypedPath(path, params),
    useParams: () => useTypedParams()
  };
};
var routes = {
  home: createTypedRoute("/"),
  user: createTypedRoute("/users/:userId"),
  userPost: createTypedRoute("/users/:userId/posts/:postId"),
  settings: createTypedRoute("/settings/:section")
};

export { CommandPalette, CompassProvider, CompassRouter, GUARD_RESULTS, InterceptingRoute, Link, NavLink, Navigate, Outlet, ParallelOutlet, ParallelRoutesProvider, ProgressBar, Route, RouteAnnouncer, RouteErrorBoundary, Routes, Transition, VERSION, ViewTransitionLink, analyticsMiddleware, anyGuard, authGuard, buildPath, buildTypedPath, clearMiddleware, combineGuards, conditionalGuard, createAction, createGuard, createLoader, createMiddleware, createRedirect, createRoute, createRouter, createTypedRoute, defineRoute, featureGuard, findRouteByName, flattenRoutes, joinPaths, loggerMiddleware, matchPath, matchRoute, mergeRouteGroups, notGuard, parsePath, permissionGuard, rateLimitGuard, registerMiddleware, resolvePath, roleGuard, routeGroup, runMiddleware, routes as typedRoutes, useAction, useBlocker, useBreadcrumbs, useFocus, useGuard, useInterceptedRoute, useIntersectionPrefetch, useLoaderData, useMiddleware, useNavigate, useNavigation, useParallelRoutes, useParams, usePendingLocation, usePrefetch, useQuery, useQueryParam, useQueryState, useRoute, useRouteMatch, useRouteSearch, useRouter, useScrollRestoration, useSlot, useTypedParams, useTypedQuery, useViewTransition };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map