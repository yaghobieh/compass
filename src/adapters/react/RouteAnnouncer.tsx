import { useEffect, useState, useRef } from 'react';
import { useRoute } from './CompassContext';
import type { RouteContext } from '../../types';

type RouteAnnouncerProps = {
  format?: (route: RouteContext) => string;
  delay?: number;
};

const STYLES = {
  announcer: {
    position: 'absolute' as const,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap' as const,
    border: 0,
  },
};

const defaultFormat = (route: RouteContext): string => {
  if (route.meta.title) {
    return `Navigated to ${route.meta.title}`;
  }
  return `Navigated to ${route.path}`;
};

export const RouteAnnouncer = ({
  format = defaultFormat,
  delay = 100,
}: RouteAnnouncerProps): JSX.Element => {
  const route = useRoute();
  const [announcement, setAnnouncement] = useState('');
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!route) return;
    
    if (previousPathRef.current !== null && previousPathRef.current !== route.path) {
      const message = format(route);
      
      setTimeout(() => {
        setAnnouncement('');
        requestAnimationFrame(() => {
          setAnnouncement(message);
        });
      }, delay);
    }
    
    previousPathRef.current = route.path;
  }, [route, format, delay]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={STYLES.announcer}
    >
      {announcement}
    </div>
  );
};

