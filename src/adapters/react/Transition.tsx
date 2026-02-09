import { useEffect, useState, useRef, ReactNode } from 'react';
import { useRoute } from './CompassContext';
import type { TransitionConfig } from '../../types';

type TransitionType = 'fade' | 'slide' | 'none';

type TransitionProps = {
  children: ReactNode;
  type?: TransitionType | TransitionConfig;
  duration?: number;
  className?: string;
};

const TRANSITION_STYLES: Record<TransitionType, { enter: string; exit: string }> = {
  fade: {
    enter: 'opacity: 0;',
    exit: 'opacity: 1;',
  },
  slide: {
    enter: 'opacity: 0; transform: translateX(20px);',
    exit: 'opacity: 1; transform: translateX(0);',
  },
  none: {
    enter: '',
    exit: '',
  },
};

export const Transition = ({
  children,
  type = 'fade',
  duration = 200,
  className,
}: TransitionProps): JSX.Element => {
  const route = useRoute();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState<'enter' | 'exit'>('exit');
  const previousPathRef = useRef<string | null>(null);

  const getStyles = (): { enter: string; exit: string } => {
    if (typeof type === 'object') {
      return type;
    }
    return TRANSITION_STYLES[type] || TRANSITION_STYLES.none;
  };

  const styles = getStyles();
  const transitionDuration = typeof type === 'object' ? (type.duration || duration) : duration;

  useEffect(() => {
    if (!route?.path) return;

    if (previousPathRef.current !== null && previousPathRef.current !== route.path) {
      setIsTransitioning(true);
      setPhase('enter');
      
      const exitTimer = setTimeout(() => {
        setDisplayChildren(children);
        setPhase('exit');
      }, transitionDuration / 2);

      const completeTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration);

      previousPathRef.current = route.path;

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    } else {
      previousPathRef.current = route.path;
      setDisplayChildren(children);
    }
  }, [route?.path, children, transitionDuration]);

  const currentStyle = phase === 'enter' ? styles.enter : styles.exit;

  return (
    <div
      className={className}
      style={{
        transition: `all ${transitionDuration}ms ease-out`,
        ...(isTransitioning ? parseStyleString(currentStyle) : {}),
      }}
    >
      {displayChildren}
    </div>
  );
};

const parseStyleString = (styleString: string): React.CSSProperties => {
  const styles: Record<string, string> = {};
  
  styleString.split(';').forEach((rule) => {
    const [property, value] = rule.split(':').map((s) => s.trim());
    if (property && value) {
      const camelCase = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styles[camelCase] = value;
    }
  });
  
  return styles as React.CSSProperties;
};

