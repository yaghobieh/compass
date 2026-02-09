import { useState, useEffect, useCallback, ReactNode, ComponentType } from 'react';
import { useRoute, useNavigate, useRouter } from './CompassContext';
import type { RouteContext } from '../../types';

type InterceptingRouteProps = {
  pattern: string;
  interceptFrom?: string[];
  modalComponent: ComponentType<{ route: RouteContext; onClose: () => void }>;
  pageComponent: ComponentType<{ route: RouteContext }>;
  children?: ReactNode;
};

export const InterceptingRoute = ({
  pattern,
  interceptFrom,
  modalComponent: ModalComponent,
  pageComponent: PageComponent,
}: InterceptingRouteProps): JSX.Element | null => {
  const route = useRoute();
  const router = useRouter();
  const { back } = useNavigate();
  const [interceptedRoute, setInterceptedRoute] = useState<RouteContext | null>(null);
  const [showModal, setShowModal] = useState(false);

  const matchesPattern = useCallback(
    (path: string) => {
      const patternParts = pattern.split('/').filter(Boolean);
      const pathParts = path.split('/').filter(Boolean);

      if (patternParts.length !== pathParts.length) return false;

      return patternParts.every((part, i) => {
        if (part.startsWith(':')) return true;
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
      const shouldIntercept =
        !interceptFrom ||
        interceptFrom.length === 0 ||
        (previousRoute && interceptFrom.some((from) => previousRoute.path.startsWith(from)));

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
    return <ModalComponent route={interceptedRoute} onClose={handleClose} />;
  }

  if (route && matchesPattern(route.path)) {
    return <PageComponent route={route} />;
  }

  return null;
};

export const useInterceptedRoute = () => {
  const router = useRouter();
  const route = useRoute();
  const state = router.getState();

  return {
    isIntercepted: !!state.previousRoute && route !== null,
    previousRoute: state.previousRoute,
    currentRoute: route,
  };
};

