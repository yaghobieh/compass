import type { ReactNode } from 'react';
import { useRoute, useCompassContext } from './CompassContext';
import { matchRoute } from '../../utils';
import { Suspense } from 'react';
import type { ComponentType } from 'react';
import type { RouteComponentProps } from '../../types';

export type OutletProps = {
  fallback?: ReactNode;
};

export const Outlet = ({ fallback }: OutletProps): JSX.Element | null => {
  const { router } = useCompassContext();
  const route = useRoute();

  if (!route) return null;

  const routes = router.getRoutes();
  const match = matchRoute(routes, route.path);

  if (!match || match.matched.length < 2) {
    return null;
  }

  const childRoute = match.matched[match.matched.length - 1];

  if (childRoute.element) {
    return (
      <Suspense fallback={fallback || <div>Loading...</div>}>
        {childRoute.element}
      </Suspense>
    );
  }

  if (childRoute.component) {
    const Component = childRoute.component as ComponentType<RouteComponentProps>;
    return (
      <Suspense fallback={fallback || <div>Loading...</div>}>
        <Component route={route} />
      </Suspense>
    );
  }

  return null;
};

