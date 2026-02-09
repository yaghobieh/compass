import type { Guard, GuardFn, GuardResult, RouteContext } from '../types';
import { GUARD_RESULTS } from '../constants';

/**
 * Create a named guard with optional deny handler
 */
export const createGuard = (
  name: string,
  check: GuardFn,
  onDeny?: (result: GuardResult, context: RouteContext) => void
): Guard => ({
  name,
  check,
  onDeny,
});

/**
 * Built-in guard: Check if user is authenticated
 */
export const authGuard = (
  isAuthenticated: () => boolean,
  redirectTo = '/login'
): Guard => createGuard(
  'auth',
  () => {
    if (isAuthenticated()) {
      return GUARD_RESULTS.ALLOW;
    }
    return { allowed: false, redirect: redirectTo, reason: 'Not authenticated' };
  }
);

/**
 * Built-in guard: Check if user has specific role
 */
export const roleGuard = (
  allowedRoles: string[],
  getCurrentRole: () => string | null,
  redirectTo = '/unauthorized'
): Guard => createGuard(
  'role',
  () => {
    const role = getCurrentRole();
    if (role && allowedRoles.includes(role)) {
      return GUARD_RESULTS.ALLOW;
    }
    return { 
      allowed: false, 
      redirect: redirectTo, 
      reason: `Role '${role}' not in allowed roles: ${allowedRoles.join(', ')}` 
    };
  }
);

/**
 * Built-in guard: Check if user has specific permission
 */
export const permissionGuard = (
  requiredPermissions: string[],
  getUserPermissions: () => string[],
  redirectTo = '/unauthorized'
): Guard => createGuard(
  'permission',
  () => {
    const permissions = getUserPermissions();
    const hasAll = requiredPermissions.every((p) => permissions.includes(p));
    
    if (hasAll) {
      return GUARD_RESULTS.ALLOW;
    }
    
    const missing = requiredPermissions.filter((p) => !permissions.includes(p));
    return { 
      allowed: false, 
      redirect: redirectTo, 
      reason: `Missing permissions: ${missing.join(', ')}` 
    };
  }
);

/**
 * Built-in guard: Check custom condition
 */
export const conditionalGuard = (
  name: string,
  condition: (context: RouteContext) => boolean,
  redirectTo?: string,
  reason?: string
): Guard => createGuard(
  name,
  (context) => {
    if (condition(context)) {
      return GUARD_RESULTS.ALLOW;
    }
    return { allowed: false, redirect: redirectTo, reason };
  }
);

/**
 * Built-in guard: Check if feature flag is enabled
 */
export const featureGuard = (
  featureName: string,
  isFeatureEnabled: (name: string) => boolean,
  redirectTo = '/not-found'
): Guard => createGuard(
  `feature:${featureName}`,
  () => {
    if (isFeatureEnabled(featureName)) {
      return GUARD_RESULTS.ALLOW;
    }
    return { 
      allowed: false, 
      redirect: redirectTo, 
      reason: `Feature '${featureName}' is not enabled` 
    };
  }
);

/**
 * Built-in guard: Rate limiting
 */
export const rateLimitGuard = (
  maxAttempts: number,
  windowMs: number,
  keyFn: (context: RouteContext) => string = (ctx) => ctx.path
): Guard => {
  const attempts = new Map<string, { count: number; resetAt: number }>();
  
  return createGuard(
    'rateLimit',
    (context) => {
      const key = keyFn(context);
      const now = Date.now();
      const entry = attempts.get(key);
      
      if (!entry || now > entry.resetAt) {
        attempts.set(key, { count: 1, resetAt: now + windowMs });
        return GUARD_RESULTS.ALLOW;
      }
      
      if (entry.count >= maxAttempts) {
        return { 
          allowed: false, 
          reason: `Rate limit exceeded. Try again in ${Math.ceil((entry.resetAt - now) / 1000)}s` 
        };
      }
      
      entry.count++;
      return GUARD_RESULTS.ALLOW;
    }
  );
};

/**
 * Combine multiple guards with AND logic
 */
export const combineGuards = (guards: Guard[], name = 'combined'): Guard => createGuard(
  name,
  async (context) => {
    for (const guard of guards) {
      const result = await Promise.resolve(guard.check(context));
      if (!result.allowed) {
        return result;
      }
    }
    return GUARD_RESULTS.ALLOW;
  }
);

/**
 * Create a guard that passes if ANY guard passes (OR logic)
 */
export const anyGuard = (guards: Guard[], name = 'any'): Guard => createGuard(
  name,
  async (context) => {
    const results: GuardResult[] = [];
    
    for (const guard of guards) {
      const result = await Promise.resolve(guard.check(context));
      if (result.allowed) {
        return GUARD_RESULTS.ALLOW;
      }
      results.push(result);
    }
    
    const lastResult = results[results.length - 1];
    return lastResult ?? GUARD_RESULTS.DENY;
  }
);

/**
 * Negate a guard result
 */
export const notGuard = (guard: Guard, name?: string): Guard => createGuard(
  name ?? `not:${guard.name}`,
  async (context) => {
    const result = await Promise.resolve(guard.check(context));
    return result.allowed ? GUARD_RESULTS.DENY : GUARD_RESULTS.ALLOW;
  }
);

