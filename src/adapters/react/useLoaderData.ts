import { useState, useEffect, useCallback, useRef } from 'react';
import { useRoute } from './CompassContext';
import type { LoaderFn, LoaderContext } from '../../types';

type LoaderState<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  isStale: boolean;
};

type UseLoaderDataOptions = {
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  staleTime?: number;
};

export const useLoaderData = <T = unknown>(
  loader?: LoaderFn<T>,
  options: UseLoaderDataOptions = {}
): LoaderState<T> & { revalidate: () => void } => {
  const route = useRoute();
  const {
    revalidateOnFocus = false,
    revalidateOnReconnect = false,
    staleTime = 0,
  } = options;

  const [state, setState] = useState<LoaderState<T>>({
    data: undefined,
    isLoading: true,
    error: null,
    isStale: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastLoadTimeRef = useRef<number>(0);

  const load = useCallback(async () => {
    if (!route || !loader) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    const context: LoaderContext = {
      params: route.params,
      query: route.query,
      request: new Request(window.location.href),
      signal: abortControllerRef.current.signal,
    };

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await Promise.resolve(loader(context));
      lastLoadTimeRef.current = Date.now();
      setState({ data, isLoading: false, error: null, isStale: false });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error as Error,
        }));
      }
    }
  }, [route, loader]);

  const revalidate = useCallback(() => {
    load();
  }, [load]);

  useEffect(() => {
    load();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [load]);

  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => {
      const now = Date.now();
      if (now - lastLoadTimeRef.current > staleTime) {
        setState((prev) => ({ ...prev, isStale: true }));
        revalidate();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [revalidateOnFocus, staleTime, revalidate]);

  useEffect(() => {
    if (!revalidateOnReconnect) return;

    const handleOnline = () => {
      revalidate();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [revalidateOnReconnect, revalidate]);

  return { ...state, revalidate };
};

export const createLoader = <T>(loader: LoaderFn<T>): LoaderFn<T> => loader;

