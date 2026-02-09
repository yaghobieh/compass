import { useEffect, useCallback, useRef } from 'react';
import { useRoute } from './CompassContext';
import type { ScrollPosition } from '../../types';

type ScrollRestorationMode = 'auto' | 'manual' | 'disabled';

const scrollPositions = new Map<string, ScrollPosition>();

export const useScrollRestoration = (
  mode: ScrollRestorationMode = 'auto'
): {
  savePosition: () => void;
  restorePosition: () => void;
  scrollTo: (position: ScrollPosition) => void;
  scrollToTop: () => void;
} => {
  const route = useRoute();
  const previousPathRef = useRef<string | null>(null);

  const savePosition = useCallback(() => {
    if (!route?.path) return;
    scrollPositions.set(route.path, {
      x: window.scrollX,
      y: window.scrollY,
    });
  }, [route?.path]);

  const restorePosition = useCallback(() => {
    if (!route?.path) return;
    const position = scrollPositions.get(route.path);
    if (position) {
      window.scrollTo(position.x, position.y);
    }
  }, [route?.path]);

  const scrollTo = useCallback((position: ScrollPosition) => {
    window.scrollTo(position.x, position.y);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (mode === 'disabled') return;
    if (!route?.path) return;

    if (previousPathRef.current && previousPathRef.current !== route.path) {
      scrollPositions.set(previousPathRef.current, {
        x: window.scrollX,
        y: window.scrollY,
      });
    }

    previousPathRef.current = route.path;

    if (mode === 'auto') {
      const savedPosition = scrollPositions.get(route.path);
      if (savedPosition) {
        requestAnimationFrame(() => {
          window.scrollTo(savedPosition.x, savedPosition.y);
        });
      } else {
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
      }
    }
  }, [route?.path, mode]);

  useEffect(() => {
    if (mode === 'disabled') return;

    const handlePopState = () => {
      if (route?.path) {
        const position = scrollPositions.get(route.path);
        if (position) {
          requestAnimationFrame(() => {
            window.scrollTo(position.x, position.y);
          });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [route?.path, mode]);

  return {
    savePosition,
    restorePosition,
    scrollTo,
    scrollToTop,
  };
};

