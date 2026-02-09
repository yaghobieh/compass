import { useMemo } from 'react';
import { useRoute } from './CompassContext';
import { matchPath } from '../../utils';
import type { RouteParams } from '../../types';

type UseRouteMatchReturn<T extends RouteParams = RouteParams> = {
  matched: boolean;
  params: T;
};

export const useRouteMatch = <T extends RouteParams = RouteParams>(
  pattern: string
): UseRouteMatchReturn<T> => {
  const route = useRoute();

  return useMemo(() => {
    if (!route) {
      return { matched: false, params: {} as T };
    }

    const { matched, params } = matchPath(pattern, route.path);
    return { matched, params: params as T };
  }, [route, pattern]);
};

