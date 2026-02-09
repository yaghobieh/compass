import type { RouteConfig, RouteProps } from '../../types';

/**
 * Route component for declarative route definition
 * Note: This is primarily used for configuration, not rendering
 */
export const Route = (_props: RouteProps): null => {
  return null;
};

/**
 * Helper to extract RouteConfig from Route components
 */
export const routeFromProps = (props: RouteProps): RouteConfig => ({
  path: props.path,
  name: props.name,
  component: props.component,
  element: props.element,
  guards: props.guards,
  meta: props.meta,
  redirect: props.redirect,
  index: props.index,
  layout: props.layout,
  fallback: props.fallback,
});

