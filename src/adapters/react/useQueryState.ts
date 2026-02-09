import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, useRoute } from './CompassContext';

type QueryValue = string | number | boolean | null | undefined;
type QueryObject = Record<string, QueryValue | QueryValue[]>;

type UseQueryStateOptions<T extends QueryObject> = {
  defaultValue?: T;
  replace?: boolean;
};

export const useQueryState = <T extends QueryObject>(
  options: UseQueryStateOptions<T> = {}
): [T, (updates: Partial<T>) => void, () => void] => {
  const router = useRouter();
  const route = useRoute();
  const { defaultValue = {} as T, replace = true } = options;

  const parseQuery = useCallback((): T => {
    const result = { ...defaultValue } as T;
    
    if (route?.query) {
      Object.entries(route.query).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key in defaultValue) {
            const defaultVal = defaultValue[key as keyof T];
            if (typeof defaultVal === 'number') {
              (result as any)[key] = Number(value);
            } else if (typeof defaultVal === 'boolean') {
              (result as any)[key] = value === 'true';
            } else {
              (result as any)[key] = value;
            }
          } else {
            (result as any)[key] = value;
          }
        }
      });
    }
    
    return result;
  }, [route?.query, defaultValue]);

  const [state, setState] = useState<T>(parseQuery);

  useEffect(() => {
    setState(parseQuery());
  }, [parseQuery]);

  const setQuery = useCallback((updates: Partial<T>) => {
    const newState = { ...state, ...updates };
    setState(newState);

    const queryParts: string[] = [];
    Object.entries(newState).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
          });
        } else {
          queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
        }
      }
    });

    const newSearch = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const newPath = (route?.path.split('?')[0] || '/') + newSearch;

    router.navigate(newPath, { replace });
  }, [state, route?.path, router, replace]);

  const resetQuery = useCallback(() => {
    setState(defaultValue);
    const basePath = route?.path.split('?')[0] || '/';
    router.navigate(basePath, { replace });
  }, [defaultValue, route?.path, router, replace]);

  return [state, setQuery, resetQuery];
};

export const useQueryParam = <T extends QueryValue>(
  key: string,
  defaultValue?: T
): [T | undefined, (value: T | undefined) => void] => {
  const router = useRouter();
  const route = useRoute();

  const value = useMemo(() => {
    const queryValue = route?.query[key];
    if (queryValue === undefined) return defaultValue;
    
    if (typeof defaultValue === 'number') {
      return Number(queryValue) as T;
    }
    if (typeof defaultValue === 'boolean') {
      return (queryValue === 'true') as unknown as T;
    }
    return queryValue as T;
  }, [route?.query, key, defaultValue]);

  const setValue = useCallback((newValue: T | undefined) => {
    const currentQuery = route?.query || {};
    const newQuery = { ...currentQuery };
    
    if (newValue === undefined || newValue === null) {
      delete newQuery[key];
    } else {
      newQuery[key] = String(newValue);
    }

    const queryParts: string[] = [];
    Object.entries(newQuery).forEach(([k, v]) => {
      if (v !== undefined) {
        if (Array.isArray(v)) {
          v.forEach((val) => {
            queryParts.push(`${encodeURIComponent(k)}=${encodeURIComponent(val)}`);
          });
        } else {
          queryParts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
        }
      }
    });

    const newSearch = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const basePath = route?.path.split('?')[0] || '/';
    router.navigate(basePath + newSearch, { replace: true });
  }, [route?.query, route?.path, router, key]);

  return [value, setValue];
};

