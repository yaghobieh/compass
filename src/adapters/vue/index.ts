import {
  computed,
  defineComponent,
  h,
  inject,
  onUnmounted,
  provide,
  ref,
} from 'vue';
import { CompassRouter, createRouter } from '../../core';
import type { CoreRouteConfig, CoreRouterConfig, Guard, GuardFn } from '../../types/core';
import { matchRoute } from '../../utils';
import { getComponent, registerComponent, resolveComponentRef, resolveRouteComponents } from '../../utils/componentRegistry';
import { createRoute } from '../../utils/createRoute';

export const COMPASS_ROUTER_KEY = Symbol('forge-compass-router');
const COMPASS_DEPTH_KEY = Symbol('forge-compass-depth');

const isGuardHook = (hook: unknown): hook is Guard | GuardFn | string => {
  if (typeof hook === 'function' || typeof hook === 'string') return true;
  return !!hook && typeof hook === 'object' && 'check' in hook;
};

const normalizeVueRoute = (route: CoreRouteConfig): CoreRouteConfig => {
  const guards = [...(route.guards ?? [])];
  const beforeEnter = route.beforeEnter;
  const hooks = Array.isArray(beforeEnter) ? beforeEnter : beforeEnter ? [beforeEnter] : [];
  for (const hook of hooks) {
    if (isGuardHook(hook)) guards.push(hook);
  }
  if (typeof route.fn === 'function') guards.push(route.fn);

  return {
    ...route,
    guards,
    children: route.children?.map(normalizeVueRoute),
  };
};

export type CompassVueRouter = CompassRouter & {
  install(app: { provide(key: symbol, value: unknown): void }): void;
};

export const createCompassRouter = (
  routes: CoreRouteConfig[],
  options?: Omit<CoreRouterConfig, 'routes'>
): CompassVueRouter => {
  const router = createRouter({
    ...options,
    routes: routes.map(normalizeVueRoute),
  });

  const install = (app: { provide(key: symbol, value: unknown): void }) => {
    app.provide(COMPASS_ROUTER_KEY, router);
  };

  return Object.assign(router, { install });
};

const useRouterState = () => {
  const router = inject<CompassRouter | null>(COMPASS_ROUTER_KEY, null);
  if (!router) {
    throw new Error('Compass router was not provided. Call app.use(createCompassRouter(routes)).');
  }
  const state = ref(router.getState());
  const stop = router.subscribe((next) => {
    state.value = next;
  });
  onUnmounted(stop);
  return { router, state };
};

export const useRoute = () => {
  const { state } = useRouterState();
  return computed(() => state.value.currentRoute);
};

export const useParams = () => {
  const route = useRoute();
  return computed(() => route.value?.params ?? {});
};

export const CompassView = defineComponent({
  name: 'CompassView',
  setup() {
    const { router, state } = useRouterState();
    const depth = inject(COMPASS_DEPTH_KEY, 0);
    provide(COMPASS_DEPTH_KEY, depth + 1);

    return () => {
      const current = state.value.currentRoute;
      if (!current) return null;
      const match = matchRoute(router.getRoutes(), current.path);
      const route = match?.matched[depth];
      if (!route) return null;
      const component = resolveComponentRef(route.component);
      if (!component || typeof component === 'string') return null;
      return h(component, { route: current, params: current.params });
    };
  },
});

export const CompassLink = defineComponent({
  name: 'CompassLink',
  props: {
    to: { type: String, required: true },
    replace: { type: Boolean, default: false },
  },
  setup(props: { to: string; replace: boolean }, { slots }: { slots: { default?: () => unknown } }) {
    const router = inject<CompassRouter | null>(COMPASS_ROUTER_KEY, null);
    const onClick = (event: MouseEvent) => {
      if (!router) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      router.navigate(props.to, { replace: props.replace });
    };
    return () => h('a', { href: props.to, onClick }, slots.default?.());
  },
});

export { createRoute, registerComponent, getComponent, resolveRouteComponents };
