import type { RouteConfig, RouteParams, QueryParams, RouteContext, MatchResult } from '../types';
import { ROUTE_PATTERNS, DEFAULT_META } from '../constants';

export const generateId = (): string => Math.random().toString(36).substring(2, 11);

export const parsePath = (path: string): { pathname: string; query: QueryParams; hash: string } => {
  const hashIndex = path.indexOf('#');
  const queryIndex = path.indexOf('?');
  
  let pathname = path;
  let queryString = '';
  let hash = '';
  
  if (hashIndex !== -1) {
    hash = path.slice(hashIndex + 1);
    pathname = path.slice(0, hashIndex);
  }
  
  if (queryIndex !== -1) {
    queryString = pathname.slice(queryIndex + 1);
    pathname = pathname.slice(0, queryIndex);
  }
  
  const query: QueryParams = {};
  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((value, key) => {
      const existing = query[key];
      if (existing !== undefined) {
        query[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
      } else {
        query[key] = value;
      }
    });
  }
  
  return { pathname, query, hash };
};

export const buildPath = (
  pathname: string,
  query?: QueryParams,
  hash?: string
): string => {
  let path = pathname;
  
  if (query && Object.keys(query).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else if (value !== undefined) {
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

export const matchPath = (
  pattern: string,
  pathname: string
): { matched: boolean; params: RouteParams } => {
  const params: RouteParams = {};
  
  if (pattern === '*' || pattern === '**') {
    return { matched: true, params: { '*': pathname } };
  }
  
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  
  if (patternParts.length !== pathParts.length) {
    const hasWildcard = patternParts.some((p) => p === '*' || p === '**');
    if (!hasWildcard) {
      return { matched: false, params };
    }
  }
  
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];
    
    if (patternPart === '*' || patternPart === '**') {
      params['*'] = pathParts.slice(i).join('/');
      return { matched: true, params };
    }
    
    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1).replace('?', '');
      const isOptional = patternPart.endsWith('?');
      
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

export const matchRoute = (
  routes: RouteConfig[],
  pathname: string,
  parentPath = ''
): MatchResult => {
  for (const route of routes) {
    const fullPath = joinPaths(parentPath, route.path);
    const { matched, params } = matchPath(fullPath, pathname);
    
    if (matched) {
      if (route.children && route.children.length > 0) {
        const childMatch = matchRoute(route.children, pathname, fullPath);
        if (childMatch) {
          return {
            route: childMatch.route,
            params: { ...params, ...childMatch.params },
            matched: [route, ...childMatch.matched],
          };
        }
      }
      
      return {
        route,
        params,
        matched: [route],
      };
    }
  }
  
  return null;
};

export const joinPaths = (...paths: string[]): string => {
  return '/' + paths
    .map((p) => p.replace(/^\/|\/$/g, ''))
    .filter(Boolean)
    .join('/');
};

export const resolvePath = (
  pattern: string,
  params: RouteParams = {}
): string => {
  let resolved = pattern;
  
  Object.entries(params).forEach(([key, value]) => {
    resolved = resolved.replace(`:${key}`, value);
    resolved = resolved.replace(`:${key}?`, value);
  });
  
  resolved = resolved.replace(ROUTE_PATTERNS.OPTIONAL_PARAM, '');
  
  return resolved;
};

export const createRouteContext = (
  path: string,
  params: RouteParams = {},
  route?: RouteConfig,
  state?: unknown
): RouteContext => {
  const { pathname, query, hash } = parsePath(path);
  
  return {
    path: pathname,
    params,
    query,
    hash,
    state,
    meta: route?.meta ?? { ...DEFAULT_META },
  };
};

export const flattenRoutes = (
  routes: RouteConfig[],
  parentPath = ''
): Array<RouteConfig & { fullPath: string }> => {
  const result: Array<RouteConfig & { fullPath: string }> = [];
  
  for (const route of routes) {
    const fullPath = joinPaths(parentPath, route.path);
    result.push({ ...route, fullPath });
    
    if (route.children) {
      result.push(...flattenRoutes(route.children, fullPath));
    }
  }
  
  return result;
};

export const findRouteByName = (
  routes: RouteConfig[],
  name: string
): RouteConfig | null => {
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

export const scrollToTop = (): void => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

export const updateDocumentTitle = (title?: string): void => {
  if (typeof document !== 'undefined' && title) {
    document.title = title;
  }
};

export const updateMetaTags = (meta?: RouteContext['meta']): void => {
  if (typeof document === 'undefined' || !meta) return;
  
  const updateMeta = (name: string, content?: string) => {
    if (!content) return;
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };
  
  if (meta.description) updateMeta('description', meta.description);
  if (meta.keywords?.length) updateMeta('keywords', meta.keywords.join(', '));
  
  if (meta.og) {
    const updateOg = (prop: string, content?: string) => {
      if (!content) return;
      let tag = document.querySelector(`meta[property="og:${prop}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', `og:${prop}`);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    
    updateOg('title', meta.og.title);
    updateOg('description', meta.og.description);
    updateOg('image', meta.og.image);
  }
};

