import { useCallback, useRef } from 'react';
import { useCompassContext } from './CompassContext';

type ViewTransitionResult = {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
};

type UseViewTransitionOptions = {
  enabled?: boolean;
  types?: string[];
};

type UseViewTransitionReturn = {
  isSupported: boolean;
  isTransitioning: boolean;
  startTransition: (callback: () => void | Promise<void>) => Promise<void>;
};

export const useViewTransition = (
  options: UseViewTransitionOptions = {}
): UseViewTransitionReturn => {
  const { enabled = true } = options;
  const isTransitioningRef = useRef(false);

  const isSupported = typeof document !== 'undefined' && 'startViewTransition' in document;

  const startTransition = useCallback(
    async (callback: () => void | Promise<void>) => {
      const doc = document as any;
      if (!isSupported || !enabled || !doc.startViewTransition) {
        await callback();
        return;
      }

      isTransitioningRef.current = true;

      try {
        const transition: ViewTransitionResult = doc.startViewTransition(callback);
        await transition.finished;
      } finally {
        isTransitioningRef.current = false;
      }
    },
    [isSupported, enabled]
  );

  return {
    isSupported,
    isTransitioning: isTransitioningRef.current,
    startTransition,
  };
};

export const ViewTransitionLink = ({
  to,
  children,
  viewTransitionName,
  ...props
}: {
  to: string;
  children: React.ReactNode;
  viewTransitionName?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const { router } = useCompassContext();
  const { startTransition, isSupported } = useViewTransition();

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();

      if (isSupported) {
        await startTransition(() => {
          router.navigate(to);
        });
      } else {
        router.navigate(to);
      }
    },
    [router, to, startTransition, isSupported]
  );

  return (
    <a
      href={to}
      onClick={handleClick}
      style={viewTransitionName ? { viewTransitionName, ...props.style } : props.style}
      {...props}
    >
      {children}
    </a>
  );
};

