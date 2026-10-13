import { Suspense, Children, isValidElement, useEffect, useRef } from 'react';
import type { ReactNode, ComponentType } from 'react';
import { useCompassContext } from './CompassContext';
import type { RouteConfig, RouteComponentProps, RouteProps } from '../../types';
import { matchRoute } from '../../utils';
import { resolveComponentRef } from '../../utils/componentRegistry';
import { routeFromProps } from './Route';

const asView = (component: unknown): ComponentType<RouteComponentProps> | null => {
  const resolved = resolveComponentRef(component);
  if (!resolved || typeof resolved === 'string') return null;
  return resolved as ComponentType<RouteComponentProps>;
};

export type RoutesProps = {
  children?: ReactNode;
  fallback?: ReactNode;
};

const extractRoutesFromChildren = (children: ReactNode): RouteConfig[] => {
  const routes: RouteConfig[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const props = child.props as RouteProps & { children?: ReactNode };
    const route = routeFromProps(props);

    if (props.children) {
      route.children = extractRoutesFromChildren(props.children);
    }

    routes.push(route);
  });

  return routes;
};

export const Routes = ({ children, fallback }: RoutesProps): JSX.Element | null => {
  const { router, state } = useCompassContext();
  const childRoutesRef = useRef<RouteConfig[]>([]);
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (children && !hasRegistered.current) {
      const childRoutes = extractRoutesFromChildren(children);
      if (childRoutes.length > 0) {
        childRoutesRef.current = childRoutes;
        childRoutes.forEach((route) => {
          router.addRoute(route);
        });
        hasRegistered.current = true;
      }
    }
  }, [children, router]);

  if (state.error) {
    return <div>Error: {state.error.message}</div>;
  }

  if (!state.currentRoute) {
    return fallback ? <>{fallback}</> : null;
  }

  const currentRoute = state.currentRoute;

  const routes = router.getRoutes();
  const match = matchRoute(routes, currentRoute.path);

  if (!match) {
    const notFound = routes.find((r) => r.path === '*');
    const NotFoundComponent = notFound ? asView(notFound.component) : null;
    if (NotFoundComponent) {
      return (
        <Suspense fallback={fallback || <div>Loading...</div>}>
          <NotFoundComponent route={currentRoute} />
        </Suspense>
      );
    }
    return <div>404 - Page Not Found</div>;
  }

  const renderRoute = (route: RouteConfig, index: number): JSX.Element | null => {
    if (route.element) {
      return <Suspense key={index} fallback={route.fallback || fallback || <div>Loading...</div>}>
        {route.element}
      </Suspense>;
    }

    const Component = asView(route.component);
    if (Component) {
      return (
        <Suspense key={index} fallback={route.fallback || fallback || <div>Loading...</div>}>
          <Component route={currentRoute}>
            {route.children && route.children.map(renderRoute)}
          </Component>
        </Suspense>
      );
    }

    return null;
  };

  const matchedRoutes = match.matched;
  
  if (matchedRoutes.length === 0) {
    return null;
  }

  let result: JSX.Element | null = null;

  for (let i = matchedRoutes.length - 1; i >= 0; i--) {
    const route = matchedRoutes[i];
    
    const Layout = asView(route.layout);
    if (Layout) {
      result = (
        <Suspense fallback={route.fallback || fallback || <div>Loading...</div>}>
          <Layout route={currentRoute}>
            {result || renderRoute(route, i)}
          </Layout>
        </Suspense>
      );
    } else if (!result) {
      result = renderRoute(route, i);
    }
  }

  return result;
};

