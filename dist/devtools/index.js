'use strict';

var react = require('react');
var jsxRuntime = require('react/jsx-runtime');
require('@forgedevstack/bear/styles.css');
var bear = require('@forgedevstack/bear');

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
var VERSION, NUMBERS;
var init_constants = __esm({
  "src/constants/index.ts"() {
    VERSION = "1.0.3" ;
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
  }
});

// src/utils/index.ts
var init_utils = __esm({
  "src/utils/index.ts"() {
    init_constants();
  }
});

// src/core/Router.ts
var init_Router = __esm({
  "src/core/Router.ts"() {
    init_constants();
    init_utils();
  }
});
var init_ProgressBar = __esm({
  "src/adapters/react/ProgressBar.tsx"() {
    init_CompassContext();
  }
});
var init_RouteAnnouncer = __esm({
  "src/adapters/react/RouteAnnouncer.tsx"() {
    init_CompassContext();
  }
});
var CompassContext, getCompassContext;
var init_CompassContext = __esm({
  "src/adapters/react/CompassContext.tsx"() {
    init_Router();
    init_ProgressBar();
    init_RouteAnnouncer();
    CompassContext = react.createContext(null);
    react.lazy(() => Promise.resolve().then(() => (init_CompassDevTools(), CompassDevTools_exports)).then((m) => ({ default: m.CompassDevTools })));
    getCompassContext = () => CompassContext;
  }
});

// src/devtools/CompassDevTools.tsx
var CompassDevTools_exports = {};
__export(CompassDevTools_exports, {
  CompassDevTools: () => exports.CompassDevTools
});
var CloseIcon, ChevronLeftIcon, ChevronRightIcon, DEFAULT_CONFIG2, LogEntry; exports.CompassDevTools = void 0;
var init_CompassDevTools = __esm({
  "src/devtools/CompassDevTools.tsx"() {
    init_constants();
    init_CompassContext();
    ({ CloseIcon, ChevronLeftIcon, ChevronRightIcon } = bear.BearIcons);
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
      return /* @__PURE__ */ jsxRuntime.jsx(
        bear.Card,
        {
          style: {
            marginBottom: 8,
            background: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: 8
          },
          children: /* @__PURE__ */ jsxRuntime.jsxs(bear.CardBody, { style: { padding: 12 }, children: [
            /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { justify: "between", align: "center", style: { marginBottom: 8 }, children: [
              /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { align: "center", gap: 8, children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  bear.Box,
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
                /* @__PURE__ */ jsxRuntime.jsxs(bear.Box, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "body2", style: { color: textColor, fontWeight: 600 }, children: getTitle() }),
                  /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "caption", style: { color: mutedColor }, children: new Date(log.timestamp).toLocaleTimeString() })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(bear.Badge, { color: getBadgeColor(), size: "sm", children: log.type.toUpperCase() })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs(
              bear.Box,
              {
                style: {
                  padding: 10,
                  borderRadius: 6,
                  background: isDark ? "#09090b" : "#e4e4e7",
                  marginBottom: 8
                },
                children: [
                  /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { align: "center", gap: 8, children: [
                    /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "caption", style: { color: mutedColor }, children: "To:" }),
                    /* @__PURE__ */ jsxRuntime.jsx(
                      bear.Typography,
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
                  log.from && /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { align: "center", gap: 8, style: { marginTop: 4 }, children: [
                    /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "caption", style: { color: mutedColor }, children: "From:" }),
                    /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "caption", style: { color: mutedColor, fontFamily: "monospace" }, children: log.from })
                  ] })
                ]
              }
            ),
            log.guardName && /* @__PURE__ */ jsxRuntime.jsx(
              bear.Alert,
              {
                severity: guardPassed ? "success" : "error",
                style: { marginBottom: 8 },
                children: /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { direction: "column", gap: 4, children: [
                  /* @__PURE__ */ jsxRuntime.jsxs(bear.Typography, { variant: "body2", style: { fontWeight: 600 }, children: [
                    "Guard: ",
                    log.guardName
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "caption", children: guardPassed ? "Access granted" : `Access denied${!log.guardResult?.allowed && "reason" in (log.guardResult ?? {}) ? `: ${log.guardResult.reason}` : ""}` }),
                  !log.guardResult?.allowed && "redirect" in (log.guardResult ?? {}) && log.guardResult.redirect && /* @__PURE__ */ jsxRuntime.jsxs(bear.Typography, { variant: "caption", style: { fontFamily: "monospace" }, children: [
                    "Redirect to: ",
                    log.guardResult.redirect
                  ] })
                ] })
              }
            ),
            log.error && /* @__PURE__ */ jsxRuntime.jsxs(bear.Alert, { severity: "error", children: [
              /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "body2", style: { fontWeight: 600 }, children: "Error" }),
              /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "caption", children: log.error })
            ] }),
            log.duration !== void 0 && log.duration > 0 && /* @__PURE__ */ jsxRuntime.jsx(bear.Flex, { justify: "end", style: { marginTop: 4 }, children: /* @__PURE__ */ jsxRuntime.jsxs(bear.Badge, { color: "default", size: "sm", children: [
              log.duration,
              "ms"
            ] }) })
          ] })
        }
      );
    };
    exports.CompassDevTools = (props) => {
      const config = { ...DEFAULT_CONFIG2, ...props };
      const [isOpen, setIsOpen] = react.useState(true);
      const [logs, setLogs] = react.useState([]);
      const [isDark, setIsDark] = react.useState(config.defaultTheme === "dark");
      const [activeTab, setActiveTab] = react.useState("logs");
      const CompassContext2 = getCompassContext();
      const contextValue = react.useContext(CompassContext2);
      const routerFromContext = contextValue?.router;
      const stateFromContext = contextValue?.state;
      const [routerState, setRouterState] = react.useState(stateFromContext ?? null);
      react.useEffect(() => {
        if (stateFromContext) {
          setRouterState(stateFromContext);
        }
      }, [stateFromContext]);
      react.useEffect(() => {
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
        return /* @__PURE__ */ jsxRuntime.jsx(bear.BearProvider, { defaultMode: isDark ? "dark" : "light", children: /* @__PURE__ */ jsxRuntime.jsx(
          bear.Button,
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
            children: isRight ? /* @__PURE__ */ jsxRuntime.jsx(ChevronLeftIcon, { size: 20, color: "white" }) : /* @__PURE__ */ jsxRuntime.jsx(ChevronRightIcon, { size: 20, color: "white" })
          }
        ) });
      }
      return /* @__PURE__ */ jsxRuntime.jsx(bear.BearProvider, { defaultMode: isDark ? "dark" : "light", children: /* @__PURE__ */ jsxRuntime.jsxs(
        bear.Box,
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
            /* @__PURE__ */ jsxRuntime.jsx(bear.Box, { style: { padding: 16, borderBottom: `1px solid ${borderColor}`, background: headerBg }, children: /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { justify: "between", align: "center", children: [
              /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { align: "center", gap: 12, children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  bear.Box,
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
                /* @__PURE__ */ jsxRuntime.jsxs(bear.Box, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "h6", style: { color: textColor, fontWeight: 700 }, children: "Compass DevTools" }),
                  /* @__PURE__ */ jsxRuntime.jsxs(bear.Typography, { variant: "caption", style: { color: mutedColor }, children: [
                    "v",
                    VERSION
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { align: "center", gap: 8, children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  bear.Switch,
                  {
                    checked: isDark,
                    onChange: () => setIsDark(!isDark),
                    size: "sm"
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(bear.Button, { variant: "ghost", size: "sm", onClick: () => setIsOpen(false), children: /* @__PURE__ */ jsxRuntime.jsx(CloseIcon, { size: 18 }) })
              ] })
            ] }) }),
            routerState?.currentRoute && /* @__PURE__ */ jsxRuntime.jsx(bear.Box, { style: { padding: 12, borderBottom: `1px solid ${borderColor}` }, children: /* @__PURE__ */ jsxRuntime.jsx(bear.Card, { style: { background: isDark ? "#18181b" : "#f4f4f5", border: `1px solid ${borderColor}` }, children: /* @__PURE__ */ jsxRuntime.jsxs(bear.CardBody, { style: { padding: 12 }, children: [
              /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "caption", style: { color: mutedColor, marginBottom: 6, display: "block" }, children: "CURRENT ROUTE" }),
              /* @__PURE__ */ jsxRuntime.jsx(
                bear.Typography,
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
              routerState.currentRoute.meta?.title && /* @__PURE__ */ jsxRuntime.jsx(bear.Badge, { color: "info", size: "sm", style: { marginTop: 8 }, children: routerState.currentRoute.meta.title }),
              Object.keys(routerState.currentRoute.params).length > 0 && /* @__PURE__ */ jsxRuntime.jsx(bear.Box, { style: { marginTop: 8 }, children: /* @__PURE__ */ jsxRuntime.jsx(bear.Flex, { gap: 4, style: { flexWrap: "wrap" }, children: Object.entries(routerState.currentRoute.params).map(([key, value]) => /* @__PURE__ */ jsxRuntime.jsxs(bear.Badge, { color: "default", size: "sm", children: [
                key,
                "=",
                value
              ] }, key)) }) })
            ] }) }) }),
            /* @__PURE__ */ jsxRuntime.jsx(bear.Box, { style: { padding: 12, borderBottom: `1px solid ${borderColor}` }, children: /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { gap: 8, style: { flexWrap: "wrap" }, children: [
              /* @__PURE__ */ jsxRuntime.jsxs(bear.Badge, { color: "success", size: "sm", children: [
                "\u2713 ",
                successCount,
                " Success"
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs(bear.Badge, { color: "warning", size: "sm", children: [
                "\u26A1 ",
                guardCount,
                " Guards"
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs(bear.Badge, { color: "danger", size: "sm", children: [
                "\u2717 ",
                errorCount,
                " Failed"
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs(bear.Badge, { color: "info", size: "sm", children: [
                "\u2192 ",
                redirectCount,
                " Redirects"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsx(bear.Box, { style: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntime.jsxs(bear.Tabs, { defaultTab: activeTab, onChange: setActiveTab, children: [
              /* @__PURE__ */ jsxRuntime.jsxs(bear.TabList, { children: [
                /* @__PURE__ */ jsxRuntime.jsx(bear.Tab, { id: "logs", children: "Navigation Log" }),
                /* @__PURE__ */ jsxRuntime.jsx(bear.Tab, { id: "routes", children: "Routes" }),
                /* @__PURE__ */ jsxRuntime.jsx(bear.Tab, { id: "history", children: "History" })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(bear.TabPanel, { tabId: "logs", children: /* @__PURE__ */ jsxRuntime.jsx(bear.Box, { style: { height: "calc(100vh - 340px)", overflow: "auto", padding: 12 }, children: logs.length === 0 ? /* @__PURE__ */ jsxRuntime.jsxs(bear.Box, { style: { textAlign: "center", padding: 40 }, children: [
                /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "h6", style: { color: mutedColor, marginBottom: 8 }, children: "No navigation yet" }),
                /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "body2", style: { color: mutedColor }, children: "Navigate to see logs here" })
              ] }) : /* @__PURE__ */ jsxRuntime.jsxs(bear.Box, { children: [
                /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { justify: "between", align: "center", style: { marginBottom: 12 }, children: [
                  /* @__PURE__ */ jsxRuntime.jsxs(bear.Typography, { variant: "caption", style: { color: mutedColor }, children: [
                    logs.length,
                    " events"
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsx(bear.Button, { variant: "ghost", size: "sm", onClick: () => setLogs([]), children: "Clear" })
                ] }),
                logs.map((log) => /* @__PURE__ */ jsxRuntime.jsx(LogEntry, { log, isDark }, log.id))
              ] }) }) }),
              /* @__PURE__ */ jsxRuntime.jsx(bear.TabPanel, { tabId: "routes", children: /* @__PURE__ */ jsxRuntime.jsxs(bear.Box, { style: { height: "calc(100vh - 340px)", overflow: "auto", padding: 12 }, children: [
                /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "caption", style: { color: mutedColor, marginBottom: 12, display: "block" }, children: "REGISTERED ROUTES" }),
                routerFromContext?.getRoutes().map((route, idx) => /* @__PURE__ */ jsxRuntime.jsx(
                  bear.Card,
                  {
                    style: {
                      marginBottom: 8,
                      background: isDark ? "#18181b" : "#f4f4f5",
                      border: `1px solid ${borderColor}`
                    },
                    children: /* @__PURE__ */ jsxRuntime.jsxs(bear.CardBody, { style: { padding: 10 }, children: [
                      /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { justify: "between", align: "center", children: [
                        /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "body2", style: { fontFamily: "monospace", color: textColor }, children: route.path }),
                        route.guards && route.guards.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs(bear.Badge, { color: "warning", size: "sm", children: [
                          route.guards.length,
                          " guard",
                          route.guards.length > 1 ? "s" : ""
                        ] })
                      ] }),
                      route.name && /* @__PURE__ */ jsxRuntime.jsxs(bear.Typography, { variant: "caption", style: { color: mutedColor }, children: [
                        "name: ",
                        route.name
                      ] })
                    ] })
                  },
                  idx
                ))
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsx(bear.TabPanel, { tabId: "history", children: /* @__PURE__ */ jsxRuntime.jsxs(bear.Box, { style: { height: "calc(100vh - 340px)", overflow: "auto", padding: 12 }, children: [
                /* @__PURE__ */ jsxRuntime.jsxs(bear.Typography, { variant: "caption", style: { color: mutedColor, marginBottom: 12, display: "block" }, children: [
                  "NAVIGATION HISTORY (",
                  routerState?.history.length ?? 0,
                  ")"
                ] }),
                routerState?.history.map((entry, idx) => /* @__PURE__ */ jsxRuntime.jsx(
                  bear.Card,
                  {
                    style: {
                      marginBottom: 8,
                      background: isDark ? "#18181b" : "#f4f4f5",
                      border: `1px solid ${borderColor}`
                    },
                    children: /* @__PURE__ */ jsxRuntime.jsx(bear.CardBody, { style: { padding: 10 }, children: /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { align: "center", gap: 8, children: [
                      /* @__PURE__ */ jsxRuntime.jsx(bear.Badge, { color: "default", size: "sm", children: idx + 1 }),
                      /* @__PURE__ */ jsxRuntime.jsx(bear.Typography, { variant: "body2", style: { fontFamily: "monospace", color: textColor }, children: entry.path })
                    ] }) })
                  },
                  idx
                ))
              ] }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsx(bear.Box, { style: { padding: 12, borderTop: `1px solid ${borderColor}`, background: headerBg }, children: /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { justify: "between", align: "center", children: [
              /* @__PURE__ */ jsxRuntime.jsxs(bear.Typography, { variant: "caption", style: { color: mutedColor }, children: [
                isDark ? "\u{1F319} Dark" : "\u2600\uFE0F Light",
                " Mode"
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs(bear.Flex, { gap: 4, children: [
                routerState?.isNavigating && /* @__PURE__ */ jsxRuntime.jsx(bear.Badge, { color: "warning", size: "sm", children: "Navigating..." }),
                routerState?.error && /* @__PURE__ */ jsxRuntime.jsx(bear.Badge, { color: "danger", size: "sm", children: "Error" })
              ] })
            ] }) })
          ]
        }
      ) });
    };
  }
});

// src/devtools/index.ts
init_CompassDevTools();
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map