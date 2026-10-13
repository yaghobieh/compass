const ROUTE_SPEC = /^(\S+)\s+(\S+)\s+(\/\S+)\s+<?([A-Za-z_][A-Za-z0-9_]*)>?$/;

export type ParsedRouteSpec = {
  name: string;
  fn: string;
  path: string;
  component: string;
};

export const parseRouteSpec = (spec: string): ParsedRouteSpec => {
  const match = spec.trim().match(ROUTE_SPEC);
  if (!match) {
    throw new Error(
      `Invalid route spec: "${spec}". Expected "name fn /path Component", for example "auth function /auth/:id <UserPage>".`
    );
  }

  return {
    name: match[1],
    fn: match[2],
    path: match[3],
    component: match[4],
  };
};
