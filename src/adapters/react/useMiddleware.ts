import { useEffect, useRef } from 'react';
import { useCompassContext } from './CompassContext';
import type { MiddlewareFn, MiddlewareContext, MiddlewareNext } from '../../types';

const middlewareRegistry: MiddlewareFn[] = [];

export const registerMiddleware = (middleware: MiddlewareFn): (() => void) => {
  middlewareRegistry.push(middleware);
  return () => {
    const index = middlewareRegistry.indexOf(middleware);
    if (index > -1) {
      middlewareRegistry.splice(index, 1);
    }
  };
};

export const clearMiddleware = (): void => {
  middlewareRegistry.length = 0;
};

export const runMiddleware = async (
  middleware: MiddlewareFn[],
  context: MiddlewareContext
): Promise<void> => {
  let index = 0;

  const next: MiddlewareNext = async () => {
    if (index < middleware.length) {
      const fn = middleware[index++];
      await fn(context, next);
    }
  };

  await next();
};

export const useMiddleware = (middleware: MiddlewareFn): void => {
  const { state } = useCompassContext();
  const prevRouteRef = useRef(state.currentRoute);

  useEffect(() => {
    if (state.currentRoute && prevRouteRef.current !== state.currentRoute) {
      const context: MiddlewareContext = {
        to: state.currentRoute,
        from: prevRouteRef.current,
        params: state.currentRoute.params,
        query: state.currentRoute.query,
      };

      middleware(context, () => {});
      prevRouteRef.current = state.currentRoute;
    }
  }, [state.currentRoute, middleware]);
};

export const createMiddleware = (
  _name: string,
  handler: (context: MiddlewareContext) => void | Promise<void>
): MiddlewareFn => {
  const middleware: MiddlewareFn = async (context, next) => {
    await handler(context);
    await next();
  };
  return middleware;
};

export const loggerMiddleware: MiddlewareFn = async (context, next) => {
  const start = performance.now();
  await next();
  const duration = performance.now() - start;
  if (typeof window !== 'undefined' && (window as any).__COMPASS_DEBUG__) {
    console.log(`[Compass] ${context.from?.path || '/'} → ${context.to.path} (${duration.toFixed(2)}ms)`);
  }
};

export const analyticsMiddleware = (
  trackPageView: (path: string, params?: Record<string, string>) => void
): MiddlewareFn => {
  return async (context, next) => {
    await next();
    trackPageView(context.to.path, context.params);
  };
};

