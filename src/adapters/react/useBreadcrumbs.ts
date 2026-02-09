import { useMemo } from 'react';
import { useCompassContext, useRoute } from './CompassContext';
import type { BreadcrumbItem } from '../../types';
import { matchRoute, joinPaths } from '../../utils';

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const { router } = useCompassContext();
  const route = useRoute();

  return useMemo(() => {
    if (!route) return [];

    const routes = router.getRoutes();
    const match = matchRoute(routes, route.path);

    if (!match) return [];

    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    for (const matchedRoute of match.matched) {
      currentPath = joinPaths(currentPath, matchedRoute.path);
      
      const name = matchedRoute.meta?.title ?? matchedRoute.name ?? matchedRoute.path;
      const isActive = currentPath === route.path;

      breadcrumbs.push({
        name,
        path: currentPath,
        meta: matchedRoute.meta,
        isActive,
      });
    }

    return breadcrumbs;
  }, [router, route]);
};

