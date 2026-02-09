import type { RouterConfig, RouteMeta } from '../types';

declare const __FORGE_COMPASS_VERSION__: string;

export const VERSION = typeof __FORGE_COMPASS_VERSION__ !== 'undefined' 
  ? __FORGE_COMPASS_VERSION__ 
  : '1.0.0';

export const NUMBERS = {
  MAX_HISTORY: 50,
  GUARD_TIMEOUT: 5000,
  TRANSITION_DURATION: 300,
  PREFETCH_DELAY: 100,
  Z_INDEX: 9999,
  TOGGLE_WIDTH: 40,
  TOGGLE_HEIGHT: 80,
  PANEL_WIDTH: 360,
} as const;

export const DEFAULT_META: RouteMeta = {
  title: '',
  description: '',
  keywords: [],
};

export const DEFAULT_CONFIG: Partial<RouterConfig> = {
  routes: [],
  basePath: '',
  mode: 'history',
  scrollBehavior: 'top',
  defaultGuards: [],
};

export const ROUTE_PATTERNS = {
  PARAM: /:([^/]+)/g,
  OPTIONAL_PARAM: /:([^/]+)\?/g,
  WILDCARD: /\*/g,
  CATCH_ALL: /\*\*/g,
} as const;

export const GUARD_RESULTS = {
  ALLOW: { allowed: true } as const,
  DENY: { allowed: false } as const,
} as const;

export const LOG_COLORS: Record<string, string> = {
  navigate: '#10b981',
  guard: '#f59e0b',
  error: '#ef4444',
  redirect: '#8b5cf6',
  load: '#3b82f6',
};

export const STORAGE_KEYS = {
  HISTORY: 'forge-compass:history',
  DEVTOOLS_STATE: 'forge-compass:devtools',
} as const;

export const STYLES = {
  panel: {
    background: '#09090b',
    border: '#27272a',
    headerBg: '#0a0a0a',
  },
  text: {
    primary: '#fafafa',
    secondary: '#a1a1aa',
    muted: '#71717a',
    error: '#ef4444',
    success: '#10b981',
  },
  accent: {
    primary: '#3b82f6',
    secondary: '#2563eb',
  },
} as const;

export const logCompassInit = (show = true): void => {
  if (!show || typeof console === 'undefined') return;
  
  const gradientStyle = [
    'background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
    'color: white',
    'font-weight: bold',
    'font-size: 16px',
    'padding: 8px 16px',
    'border-radius: 8px',
    'text-shadow: 0 1px 2px rgba(0,0,0,0.3)',
  ].join(';');
  
  const subtitleStyle = [
    'color: #3b82f6',
    'font-size: 12px',
    'font-weight: 500',
    'padding: 4px 0',
  ].join(';');
  
  const linkStyle = [
    'color: #60a5fa',
    'font-size: 11px',
    'text-decoration: underline',
  ].join(';');

  console.log(
    `%c 🧭 Forge Compass v${VERSION} %c\n` +
    `%cType-safe routing with guards%c\n` +
    `%chttps://forgedevstack.com%c`,
    gradientStyle,
    '',
    subtitleStyle,
    '',
    linkStyle,
    ''
  );
};

