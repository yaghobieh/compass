import { useEffect, useState, useContext } from 'react';
import '@forgedevstack/bear/styles.css';
import {
  BearProvider,
  Button,
  Badge,
  Typography,
  Flex,
  Box,
  Card,
  CardBody,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Switch,
  Alert,
  BearIcons,
} from '@forgedevstack/bear';
import type { CompassLogEntry, RouterState } from '../types';
import { VERSION, NUMBERS } from '../constants';
import { getCompassContext } from '../adapters/react/CompassContext';

const { CloseIcon, ChevronLeftIcon, ChevronRightIcon } = BearIcons;

export type CompassDevToolsConfig = {
  enabled?: boolean;
  position?: 'right' | 'left';
  showConsoleLog?: boolean;
  panelWidth?: number;
  defaultTheme?: 'dark' | 'light';
};

const DEFAULT_CONFIG: Required<CompassDevToolsConfig> = {
  enabled: true,
  position: 'right',
  showConsoleLog: false,
  panelWidth: 400,
  defaultTheme: 'dark',
};

type LogEntryProps = {
  log: CompassLogEntry;
  isDark: boolean;
};

const LogEntry = ({ log, isDark }: LogEntryProps) => {
  const isSuccess = log.type === 'navigate';
  const isWarning = log.type === 'guard';
  const isError = log.type === 'error';
  const isRedirect = log.type === 'redirect';
  
  const guardPassed = log.guardResult?.allowed === true;
  const guardFailed = log.guardResult?.allowed === false;

  const getBadgeColor = () => {
    if (isSuccess) return 'success';
    if (isError || guardFailed) return 'danger';
    if (isRedirect) return 'info';
    if (isWarning && guardPassed) return 'success';
    if (isWarning && guardFailed) return 'danger';
    return 'warning';
  };

  const getIcon = () => {
    if (isSuccess) return '✓';
    if (isError || guardFailed) return '✗';
    if (isRedirect) return '→';
    if (isWarning && guardPassed) return '✓';
    return '⚡';
  };

  const getTitle = () => {
    if (isSuccess) return 'Navigation Success';
    if (isError) return 'Navigation Error';
    if (isRedirect) return 'Redirected';
    if (isWarning) return guardPassed ? 'Guard Passed' : 'Guard Blocked';
    return log.type;
  };

  const bgColor = isDark ? '#18181b' : '#f4f4f5';
  const borderColor = isDark ? '#27272a' : '#e4e4e7';
  const textColor = isDark ? '#fafafa' : '#18181b';
  const mutedColor = isDark ? '#71717a' : '#a1a1aa';

  return (
    <Card
      style={{
        marginBottom: 8,
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
      }}
    >
      <CardBody style={{ padding: 12 }}>
        {/* Header Row */}
        <Flex justify="between" align="center" style={{ marginBottom: 8 }}>
          <Flex align="center" gap={8}>
            <Box
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                background: isSuccess || (isWarning && guardPassed) ? '#10b98120' :
                           isError || guardFailed ? '#ef444420' :
                           isRedirect ? '#3b82f620' : '#f59e0b20',
                color: isSuccess || (isWarning && guardPassed) ? '#10b981' :
                       isError || guardFailed ? '#ef4444' :
                       isRedirect ? '#3b82f6' : '#f59e0b',
              }}
            >
              {getIcon()}
            </Box>
            <Box>
              <Typography variant="body2" style={{ color: textColor, fontWeight: 600 }}>
                {getTitle()}
              </Typography>
              <Typography variant="caption" style={{ color: mutedColor }}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </Typography>
            </Box>
          </Flex>
          <Badge color={getBadgeColor()} size="sm">
            {log.type.toUpperCase()}
          </Badge>
        </Flex>

        {/* Route Info */}
        <Box
          style={{
            padding: 10,
            borderRadius: 6,
            background: isDark ? '#09090b' : '#e4e4e7',
            marginBottom: 8,
          }}
        >
          <Flex align="center" gap={8}>
            <Typography variant="caption" style={{ color: mutedColor }}>
              To:
            </Typography>
            <Typography
              variant="body2"
              style={{
                color: isSuccess ? '#10b981' : isError || guardFailed ? '#ef4444' : '#3b82f6',
                fontFamily: 'monospace',
                fontWeight: 500,
              }}
            >
              {log.to}
            </Typography>
          </Flex>
          {log.from && (
            <Flex align="center" gap={8} style={{ marginTop: 4 }}>
              <Typography variant="caption" style={{ color: mutedColor }}>
                From:
              </Typography>
              <Typography variant="caption" style={{ color: mutedColor, fontFamily: 'monospace' }}>
                {log.from}
              </Typography>
            </Flex>
          )}
        </Box>

        {/* Guard Details */}
        {log.guardName && (
          <Alert
            severity={guardPassed ? 'success' : 'error'}
            style={{ marginBottom: 8 }}
          >
            <Flex direction="column" gap={4}>
              <Typography variant="body2" style={{ fontWeight: 600 }}>
                Guard: {log.guardName}
              </Typography>
              <Typography variant="caption">
                {guardPassed ? 'Access granted' : `Access denied${!log.guardResult?.allowed && 'reason' in (log.guardResult ?? {}) ? `: ${(log.guardResult as { reason?: string }).reason}` : ''}`}
              </Typography>
              {!log.guardResult?.allowed && 'redirect' in (log.guardResult ?? {}) && (log.guardResult as { redirect?: string }).redirect && (
                <Typography variant="caption" style={{ fontFamily: 'monospace' }}>
                  Redirect to: {(log.guardResult as { redirect?: string }).redirect}
                </Typography>
              )}
            </Flex>
          </Alert>
        )}

        {/* Error Details */}
        {log.error && (
          <Alert severity="error">
            <Typography variant="body2" style={{ fontWeight: 600 }}>
              Error
            </Typography>
            <Typography variant="caption">{log.error}</Typography>
          </Alert>
        )}

        {/* Duration */}
        {log.duration !== undefined && log.duration > 0 && (
          <Flex justify="end" style={{ marginTop: 4 }}>
            <Badge color="default" size="sm">
              {log.duration}ms
            </Badge>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

export const CompassDevTools = (props: CompassDevToolsConfig): JSX.Element | null => {
  const config = { ...DEFAULT_CONFIG, ...props };
  const [isOpen, setIsOpen] = useState(true);
  const [logs, setLogs] = useState<CompassLogEntry[]>([]);
  const [isDark, setIsDark] = useState(config.defaultTheme === 'dark');
  const [activeTab, setActiveTab] = useState('logs');
  
  const CompassContext = getCompassContext();
  const contextValue = useContext(CompassContext);
  const routerFromContext = contextValue?.router;
  const stateFromContext = contextValue?.state;
  
  const [routerState, setRouterState] = useState<RouterState | null>(stateFromContext ?? null);

  useEffect(() => {
    if (stateFromContext) {
      setRouterState(stateFromContext);
    }
  }, [stateFromContext]);

  useEffect(() => {
    const router = routerFromContext ?? (typeof window !== 'undefined' ? (window as any).__FORGE_COMPASS_ROUTER__ : null);
    
    if (!router) return;

    router.setDevToolsCallback((log: CompassLogEntry) => {
      setLogs((prev) => [log, ...prev].slice(0, 100));
    });

    let unsubscribe: (() => void) | null = null;
    if (!routerFromContext) {
      unsubscribe = router.subscribe((state: RouterState) => {
        setRouterState(state);
      });
      setRouterState(router.getState());
    }
    
    const currentState = router.getState();
    if (currentState.currentRoute && logs.length === 0) {
      setLogs([{
        id: 'initial-' + Date.now(),
        type: 'navigate' as const,
        to: currentState.currentRoute.path,
        from: undefined,
        timestamp: Date.now(),
        duration: 0,
      }]);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      router.setDevToolsCallback(null);
    };
  }, [routerFromContext, logs.length]);

  if (!config.enabled) return null;

  const isRight = config.position === 'right';
  const bgColor = isDark ? '#09090b' : '#ffffff';
  const borderColor = isDark ? '#27272a' : '#e4e4e7';
  const textColor = isDark ? '#fafafa' : '#18181b';
  const mutedColor = isDark ? '#71717a' : '#a1a1aa';
  const headerBg = isDark ? '#0a0a0a' : '#fafafa';

  // Stats
  const successCount = logs.filter(l => l.type === 'navigate').length;
  const guardCount = logs.filter(l => l.type === 'guard').length;
  const errorCount = logs.filter(l => l.type === 'error' || (l.type === 'guard' && !l.guardResult?.allowed)).length;
  const redirectCount = logs.filter(l => l.type === 'redirect').length;

  if (!isOpen) {
    return (
      <BearProvider defaultMode={isDark ? 'dark' : 'light'}>
        <Button
          variant="primary"
          onClick={() => setIsOpen(true)}
          aria-label="Open Compass DevTools"
          style={{
            position: 'fixed',
            right: isRight ? 0 : 'auto',
            left: !isRight ? 0 : 'auto',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: NUMBERS.Z_INDEX,
            width: 40,
            height: 80,
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            border: 'none',
            borderRadius: isRight ? '8px 0 0 8px' : '0 8px 8px 0',
            padding: 0,
            minWidth: 'auto',
          }}
        >
          {isRight ? <ChevronLeftIcon size={20} color="white" /> : <ChevronRightIcon size={20} color="white" />}
        </Button>
      </BearProvider>
    );
  }

  return (
    <BearProvider defaultMode={isDark ? 'dark' : 'light'}>
      <Box
        style={{
          position: 'fixed',
          right: isRight ? 0 : 'auto',
          left: !isRight ? 0 : 'auto',
          top: 0,
          bottom: 0,
          width: config.panelWidth,
          zIndex: NUMBERS.Z_INDEX,
          background: bgColor,
          borderLeft: isRight ? `1px solid ${borderColor}` : 'none',
          borderRight: !isRight ? `1px solid ${borderColor}` : 'none',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Header */}
        <Box style={{ padding: 16, borderBottom: `1px solid ${borderColor}`, background: headerBg }}>
          <Flex justify="between" align="center">
            <Flex align="center" gap={12}>
              <Box
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                🧭
              </Box>
              <Box>
                <Typography variant="h6" style={{ color: textColor, fontWeight: 700 }}>
                  Compass DevTools
                </Typography>
                <Typography variant="caption" style={{ color: mutedColor }}>
                  v{VERSION}
                </Typography>
              </Box>
            </Flex>
            <Flex align="center" gap={8}>
              <Switch
                checked={isDark}
                onChange={() => setIsDark(!isDark)}
                size="sm"
              />
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <CloseIcon size={18} />
              </Button>
            </Flex>
          </Flex>
        </Box>

        {/* Current Route Card */}
        {routerState?.currentRoute && (
          <Box style={{ padding: 12, borderBottom: `1px solid ${borderColor}` }}>
            <Card style={{ background: isDark ? '#18181b' : '#f4f4f5', border: `1px solid ${borderColor}` }}>
              <CardBody style={{ padding: 12 }}>
                <Typography variant="caption" style={{ color: mutedColor, marginBottom: 6, display: 'block' }}>
                  CURRENT ROUTE
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    color: '#3b82f6',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    wordBreak: 'break-all',
                  }}
                >
                  {routerState.currentRoute.path}
                </Typography>
                {routerState.currentRoute.meta?.title && (
                  <Badge color="info" size="sm" style={{ marginTop: 8 }}>
                    {routerState.currentRoute.meta.title}
                  </Badge>
                )}
                {Object.keys(routerState.currentRoute.params).length > 0 && (
                  <Box style={{ marginTop: 8 }}>
                    <Flex gap={4} style={{ flexWrap: 'wrap' }}>
                      {Object.entries(routerState.currentRoute.params).map(([key, value]) => (
                        <Badge key={key} color="default" size="sm">
                          {key}={value}
                        </Badge>
                      ))}
                    </Flex>
                  </Box>
                )}
              </CardBody>
            </Card>
          </Box>
        )}

        {/* Stats Row */}
        <Box style={{ padding: 12, borderBottom: `1px solid ${borderColor}` }}>
          <Flex gap={8} style={{ flexWrap: 'wrap' }}>
            <Badge color="success" size="sm">✓ {successCount} Success</Badge>
            <Badge color="warning" size="sm">⚡ {guardCount} Guards</Badge>
            <Badge color="danger" size="sm">✗ {errorCount} Failed</Badge>
            <Badge color="info" size="sm">→ {redirectCount} Redirects</Badge>
          </Flex>
        </Box>

        {/* Tabs */}
        <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Tabs defaultTab={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab id="logs">Navigation Log</Tab>
              <Tab id="routes">Routes</Tab>
              <Tab id="history">History</Tab>
            </TabList>

            <TabPanel tabId="logs">
              <Box style={{ height: 'calc(100vh - 340px)', overflow: 'auto', padding: 12 }}>
                {logs.length === 0 ? (
                  <Box style={{ textAlign: 'center', padding: 40 }}>
                    <Typography variant="h6" style={{ color: mutedColor, marginBottom: 8 }}>
                      No navigation yet
                    </Typography>
                    <Typography variant="body2" style={{ color: mutedColor }}>
                      Navigate to see logs here
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Flex justify="between" align="center" style={{ marginBottom: 12 }}>
                      <Typography variant="caption" style={{ color: mutedColor }}>
                        {logs.length} events
                      </Typography>
                      <Button variant="ghost" size="sm" onClick={() => setLogs([])}>
                        Clear
                      </Button>
                    </Flex>
                    {logs.map((log) => (
                      <LogEntry key={log.id} log={log} isDark={isDark} />
                    ))}
                  </Box>
                )}
              </Box>
            </TabPanel>

            <TabPanel tabId="routes">
              <Box style={{ height: 'calc(100vh - 340px)', overflow: 'auto', padding: 12 }}>
                <Typography variant="caption" style={{ color: mutedColor, marginBottom: 12, display: 'block' }}>
                  REGISTERED ROUTES
                </Typography>
                {routerFromContext?.getRoutes().map((route, idx) => (
                  <Card
                    key={idx}
                    style={{
                      marginBottom: 8,
                      background: isDark ? '#18181b' : '#f4f4f5',
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    <CardBody style={{ padding: 10 }}>
                      <Flex justify="between" align="center">
                        <Typography variant="body2" style={{ fontFamily: 'monospace', color: textColor }}>
                          {route.path}
                        </Typography>
                        {route.guards && route.guards.length > 0 && (
                          <Badge color="warning" size="sm">
                            {route.guards.length} guard{route.guards.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </Flex>
                      {route.name && (
                        <Typography variant="caption" style={{ color: mutedColor }}>
                          name: {route.name}
                        </Typography>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </Box>
            </TabPanel>

            <TabPanel tabId="history">
              <Box style={{ height: 'calc(100vh - 340px)', overflow: 'auto', padding: 12 }}>
                <Typography variant="caption" style={{ color: mutedColor, marginBottom: 12, display: 'block' }}>
                  NAVIGATION HISTORY ({routerState?.history.length ?? 0})
                </Typography>
                {routerState?.history.map((entry, idx) => (
                  <Card
                    key={idx}
                    style={{
                      marginBottom: 8,
                      background: isDark ? '#18181b' : '#f4f4f5',
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    <CardBody style={{ padding: 10 }}>
                      <Flex align="center" gap={8}>
                        <Badge color="default" size="sm">
                          {idx + 1}
                        </Badge>
                        <Typography variant="body2" style={{ fontFamily: 'monospace', color: textColor }}>
                          {entry.path}
                        </Typography>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </Box>
            </TabPanel>
          </Tabs>
        </Box>

        {/* Footer */}
        <Box style={{ padding: 12, borderTop: `1px solid ${borderColor}`, background: headerBg }}>
          <Flex justify="between" align="center">
            <Typography variant="caption" style={{ color: mutedColor }}>
              {isDark ? '🌙 Dark' : '☀️ Light'} Mode
            </Typography>
            <Flex gap={4}>
              {routerState?.isNavigating && <Badge color="warning" size="sm">Navigating...</Badge>}
              {routerState?.error && <Badge color="danger" size="sm">Error</Badge>}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </BearProvider>
  );
};
