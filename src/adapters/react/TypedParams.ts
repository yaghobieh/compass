import { useRoute } from './CompassContext';

type ExtractParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? { [K in Param | keyof ExtractParams<Rest>]: string }
  : T extends `${string}:${infer Param}`
  ? { [K in Param]: string }
  : Record<string, never>;

export const useTypedParams = <T extends string>(): ExtractParams<T> => {
  const route = useRoute();
  return (route?.params ?? {}) as ExtractParams<T>;
};

export const useTypedQuery = <T extends Record<string, string | number | boolean | undefined>>(): T => {
  const route = useRoute();
  return (route?.query ?? {}) as unknown as T;
};

type RouteDefinition<TPath extends string, TParams = ExtractParams<TPath>> = {
  path: TPath;
  params: TParams;
};

export const defineRoute = <TPath extends string>(
  path: TPath
): RouteDefinition<TPath> => {
  return {
    path,
    params: {} as ExtractParams<TPath>,
  };
};

export const buildTypedPath = <TPath extends string>(
  path: TPath,
  params: ExtractParams<TPath>
): string => {
  let result: string = path;
  
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, String(value));
  }
  
  return result;
};

type TypedRouteConfig<TPath extends string> = {
  path: TPath;
  getPath: (params: ExtractParams<TPath>) => string;
  useParams: () => ExtractParams<TPath>;
};

export const createTypedRoute = <TPath extends string>(
  path: TPath
): TypedRouteConfig<TPath> => {
  return {
    path,
    getPath: (params) => buildTypedPath(path, params),
    useParams: () => useTypedParams<TPath>(),
  };
};

export const routes = {
  home: createTypedRoute('/'),
  user: createTypedRoute('/users/:userId'),
  userPost: createTypedRoute('/users/:userId/posts/:postId'),
  settings: createTypedRoute('/settings/:section'),
} as const;

