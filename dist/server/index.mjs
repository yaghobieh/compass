// src/constants/index.ts
var DEFAULT_META = {
  title: "",
  description: "",
  keywords: []
};

// src/utils/index.ts
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

// src/server/index.ts
var createSSRContext = (url, routes) => {
  return {
    url,
    routes,
    loaderData: {}
  };
};
var matchSSRRoute = (routes, url) => {
  const { pathname } = parsePath(url);
  return matchRoute(routes, pathname);
};
var loadRouteData = async (routes, url, request) => {
  const match = matchSSRRoute(routes, url);
  if (!match) return {};
  const loaderData = {};
  const abortController = new AbortController();
  for (const route of match.matched) {
    const loader = route.loader;
    if (loader) {
      const parsed = parsePath(url);
      const context = {
        params: match.params,
        query: parsed.query,
        request: request || new Request(url),
        signal: abortController.signal
      };
      try {
        const data = await loader(context);
        loaderData[route.name || route.path] = data;
      } catch (error) {
        loaderData[route.name || route.path] = { error: String(error) };
      }
    }
  }
  return loaderData;
};
var getSSRHead = (route) => {
  if (!route) {
    return { meta: [], links: [] };
  }
  const meta = [];
  const links = [];
  if (route.meta.description) {
    meta.push({ name: "description", content: route.meta.description });
  }
  if (route.meta.keywords && route.meta.keywords.length > 0) {
    meta.push({ name: "keywords", content: route.meta.keywords.join(", ") });
  }
  if (route.meta.og) {
    if (route.meta.og.title) {
      meta.push({ name: "og:title", content: route.meta.og.title });
    }
    if (route.meta.og.description) {
      meta.push({ name: "og:description", content: route.meta.og.description });
    }
    if (route.meta.og.image) {
      meta.push({ name: "og:image", content: route.meta.og.image });
    }
  }
  return {
    title: route.meta.title,
    meta,
    links
  };
};
var renderHeadToString = (head) => {
  let html = "";
  if (head.title) {
    html += `<title>${escapeHtml(head.title)}</title>
`;
  }
  for (const meta of head.meta) {
    html += `<meta name="${escapeHtml(meta.name)}" content="${escapeHtml(meta.content)}" />
`;
  }
  for (const link of head.links) {
    html += `<link rel="${escapeHtml(link.rel)}" href="${escapeHtml(link.href)}" />
`;
  }
  return html;
};
var escapeHtml = (text) => {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
};
var createServerRouter = (routes) => {
  return {
    match: (url) => matchSSRRoute(routes, url),
    loadData: (url, request) => loadRouteData(routes, url, request),
    getHead: (route) => getSSRHead(route)
  };
};
var handleRequest = async (request, routes) => {
  const url = new URL(request.url);
  const match = matchSSRRoute(routes, url.pathname);
  if (!match) {
    return {
      route: null,
      loaderData: {},
      head: { meta: [], links: [] },
      status: 404
    };
  }
  if (match.route.redirect) {
    return {
      route: null,
      loaderData: {},
      head: { meta: [], links: [] },
      redirect: match.route.redirect,
      status: 302
    };
  }
  const loaderData = await loadRouteData(routes, url.pathname, request);
  const parsedPath = parsePath(url.pathname + url.search + url.hash);
  const route = createRouteContext(parsedPath.pathname, match.params, match.route);
  const head = getSSRHead(route);
  return {
    route,
    loaderData,
    head,
    status: 200
  };
};

export { createSSRContext, createServerRouter, getSSRHead, handleRequest, loadRouteData, matchSSRRoute, renderHeadToString };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map