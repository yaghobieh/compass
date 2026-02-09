import type {
  RouteConfig,
  RouteContext,
  RouteParams,
  QueryParams,
  SSRRenderResult,
  SSRContext,
  LoaderFn,
  LoaderContext,
} from '../types';
import { matchRoute, parsePath, createRouteContext } from '../utils';

export const createSSRContext = (
  url: string,
  routes: RouteConfig[]
): SSRContext => {
  return {
    url,
    routes,
    loaderData: {},
  };
};

export const matchSSRRoute = (
  routes: RouteConfig[],
  url: string
): { route: RouteConfig; params: RouteParams; matched: RouteConfig[] } | null => {
  const { pathname } = parsePath(url);
  return matchRoute(routes, pathname);
};

export const loadRouteData = async (
  routes: RouteConfig[],
  url: string,
  request?: Request
): Promise<Record<string, unknown>> => {
  const match = matchSSRRoute(routes, url);
  if (!match) return {};

  const loaderData: Record<string, unknown> = {};
  const abortController = new AbortController();

  for (const route of match.matched) {
    const loader = (route as any).loader as LoaderFn | undefined;
    if (loader) {
      const parsed = parsePath(url);
      const context: LoaderContext = {
        params: match.params,
        query: parsed.query as QueryParams,
        request: request || new Request(url),
        signal: abortController.signal,
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

export const getSSRHead = (
  route: RouteContext | null
): SSRRenderResult['head'] => {
  if (!route) {
    return { meta: [], links: [] };
  }

  const meta: Array<{ name: string; content: string }> = [];
  const links: Array<{ rel: string; href: string }> = [];

  if (route.meta.description) {
    meta.push({ name: 'description', content: route.meta.description });
  }

  if (route.meta.keywords && route.meta.keywords.length > 0) {
    meta.push({ name: 'keywords', content: route.meta.keywords.join(', ') });
  }

  if (route.meta.og) {
    if (route.meta.og.title) {
      meta.push({ name: 'og:title', content: route.meta.og.title });
    }
    if (route.meta.og.description) {
      meta.push({ name: 'og:description', content: route.meta.og.description });
    }
    if (route.meta.og.image) {
      meta.push({ name: 'og:image', content: route.meta.og.image });
    }
  }

  return {
    title: route.meta.title,
    meta,
    links,
  };
};

export const renderHeadToString = (head: SSRRenderResult['head']): string => {
  let html = '';

  if (head.title) {
    html += `<title>${escapeHtml(head.title)}</title>\n`;
  }

  for (const meta of head.meta) {
    html += `<meta name="${escapeHtml(meta.name)}" content="${escapeHtml(meta.content)}" />\n`;
  }

  for (const link of head.links) {
    html += `<link rel="${escapeHtml(link.rel)}" href="${escapeHtml(link.href)}" />\n`;
  }

  return html;
};

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export const createServerRouter = (routes: RouteConfig[]) => {
  return {
    match: (url: string) => matchSSRRoute(routes, url),
    loadData: (url: string, request?: Request) => loadRouteData(routes, url, request),
    getHead: (route: RouteContext | null) => getSSRHead(route),
  };
};

export const handleRequest = async (
  request: Request,
  routes: RouteConfig[]
): Promise<{
  route: RouteContext | null;
  loaderData: Record<string, unknown>;
  head: SSRRenderResult['head'];
  redirect?: string;
  status: number;
}> => {
  const url = new URL(request.url);
  const match = matchSSRRoute(routes, url.pathname);

  if (!match) {
    return {
      route: null,
      loaderData: {},
      head: { meta: [], links: [] },
      status: 404,
    };
  }

  if (match.route.redirect) {
    return {
      route: null,
      loaderData: {},
      head: { meta: [], links: [] },
      redirect: match.route.redirect,
      status: 302,
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
    status: 200,
  };
};

