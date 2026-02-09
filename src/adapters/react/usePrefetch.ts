import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from './CompassContext';
import type { PrefetchOptions } from '../../types';

type UsePrefetchReturn = {
  prefetch: (path: string) => void;
  prefetchOnHover: (path: string) => {
    onMouseEnter: () => void;
    onFocus: () => void;
  };
};

const prefetchedRoutes = new Set<string>();

export const usePrefetch = (options: PrefetchOptions = {}): UsePrefetchReturn => {
  const router = useRouter();
  const { delay = 100 } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefetch = useCallback((path: string) => {
    if (prefetchedRoutes.has(path)) return;
    
    prefetchedRoutes.add(path);
    
    const routes = router.getRoutes();
    const matchRoute = (routes: any[], targetPath: string): any => {
      for (const route of routes) {
        if (route.path === targetPath || route.path === targetPath.split('?')[0]) {
          return route;
        }
        if (route.children) {
          const child = matchRoute(route.children, targetPath);
          if (child) return child;
        }
      }
      return null;
    };

    const route = matchRoute(routes, path);
    if (route?.component && 'preload' in route.component) {
      (route.component as any).preload?.();
    }
  }, [router]);

  const prefetchOnHover = useCallback((path: string) => {
    return {
      onMouseEnter: () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => prefetch(path), delay);
      },
      onFocus: () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => prefetch(path), delay);
      },
    };
  }, [prefetch, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { prefetch, prefetchOnHover };
};

export const useIntersectionPrefetch = (
  paths: string[],
  options: IntersectionObserverInit = {}
): React.RefObject<HTMLElement> => {
  const ref = useRef<HTMLElement>(null);
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

