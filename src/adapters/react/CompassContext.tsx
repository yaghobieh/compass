import { createContext, useContext, useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { CompassRouter, createRouter } from '../../core/Router';
import type { RouterState, RouteContext, RouteParams, QueryParams, NavigateOptions, CompassProviderConfig } from '../../types';
import { ProgressBar } from './ProgressBar';
import { RouteAnnouncer } from './RouteAnnouncer';

type CompassContextValue = {
  router: CompassRouter;
  state: RouterState;
  devToolsEnabled: boolean;
  config: CompassProviderConfig;
};

const CompassContext = createContext<CompassContextValue | null>(null);

const LazyDevTools = lazy(() => import('../../devtools/CompassDevTools').then(m => ({ default: m.CompassDevTools })));

// Export context for DevTools to use
export const getCompassContext = () => CompassContext;

export type CompassProviderProps = CompassProviderConfig & {
  children: ReactNode;
};

export const CompassProvider = ({ 
  children, 
  devTools = false,
  devToolsPosition = 'right',
  showProgress = false,
  progressColor = '#3b82f6',
  scrollRestoration = 'auto',
  announceRoutes = false,
  announceFormat,
  transition,
  transitionDuration,
  ...config 
}: CompassProviderProps): JSX.Element => {
  const [router] = useState(() => createRouter(config));
  const [state, setState] = useState<RouterState>(router.getState());

  const fullConfig: CompassProviderConfig = {
    ...config,
    devTools,
    devToolsPosition,
    showProgress,
    progressColor,
    scrollRestoration,
    announceRoutes,
    announceFormat,
    transition,
    transitionDuration,
  };

  useEffect(() => {
    const unsubscribe = router.subscribe(setState);
    return () => {
      unsubscribe();
      router.destroy();
    };
  }, [router]);

  const value = useMemo(
    () => ({ router, state, devToolsEnabled: devTools, config: fullConfig }),
    [router, state, devTools, fullConfig]
  );

  return (
    <CompassContext.Provider value={value}>
      {showProgress && <ProgressBar color={progressColor} />}
      {announceRoutes && <RouteAnnouncer format={announceFormat} />}
      {children}
      {devTools && (
        <Suspense fallback={null}>
          <LazyDevTools position={devToolsPosition} showConsoleLog={false} />
        </Suspense>
      )}
    </CompassContext.Provider>
  );
};

export const useCompassContext = (): CompassContextValue => {
  const context = useContext(CompassContext);
  if (!context) {
    throw new Error('useCompassContext must be used within a CompassProvider');
  }
  return context;
};

export const useRouter = (): CompassRouter => {
  const { router } = useCompassContext();
  return router;
};

export const useRoute = (): RouteContext | null => {
  const { state } = useCompassContext();
  return state.currentRoute;
};

export const useParams = <T extends RouteParams = RouteParams>(): T => {
  const route = useRoute();
  return (route?.params ?? {}) as T;
};

export const useQuery = <T extends QueryParams = QueryParams>(): T => {
  const route = useRoute();
  return (route?.query ?? {}) as T;
};

export const useNavigate = () => {
  const router = useRouter();

  const navigate = useCallback(
    (to: string, options?: NavigateOptions) => {
      router.navigate(to, options);
    },
    [router]
  );

  const push = useCallback(
    (to: string, options?: NavigateOptions) => {
      router.push(to, options);
    },
    [router]
  );

  const replace = useCallback(
    (to: string, options?: NavigateOptions) => {
      router.replace(to, options);
    },
    [router]
  );

  const back = useCallback(() => router.back(), [router]);
  const forward = useCallback(() => router.forward(), [router]);
  const go = useCallback((delta: number) => router.go(delta), [router]);

  return useMemo(
    () => ({ navigate, push, replace, back, forward, go }),
    [navigate, push, replace, back, forward, go]
  );
};

