import { useEffect, useCallback, useRef } from 'react';
import { useRoute } from './CompassContext';
import type { FocusTarget } from '../../types';

type UseFocusReturn = {
  setFocus: (target: FocusTarget) => void;
  focusMain: () => void;
  focusHeading: () => void;
  focusFirstInput: () => void;
};

export const useFocus = (autoFocus?: FocusTarget): UseFocusReturn => {
  const route = useRoute();
  const previousPathRef = useRef<string | null>(null);

  const focusElement = useCallback((selector: string) => {
    requestAnimationFrame(() => {
      const element = document.querySelector<HTMLElement>(selector);
      if (element) {
        element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
      }
    });
  }, []);

  const setFocus = useCallback((target: FocusTarget) => {
    switch (target) {
      case 'heading':
        focusElement('h1, [role="heading"]');
        break;
      case 'first-input':
        focusElement('input:not([type="hidden"]), textarea, select, [contenteditable="true"]');
        break;
      case 'main':
        focusElement('main, [role="main"], #main');
        break;
      default:
        if (target.startsWith('#') || target.startsWith('.') || target.startsWith('[')) {
          focusElement(target);
        }
        break;
    }
  }, [focusElement]);

  const focusMain = useCallback(() => setFocus('main'), [setFocus]);
  const focusHeading = useCallback(() => setFocus('heading'), [setFocus]);
  const focusFirstInput = useCallback(() => setFocus('first-input'), [setFocus]);

  useEffect(() => {
    if (!autoFocus || !route?.path) return;
    
    if (previousPathRef.current !== route.path) {
      previousPathRef.current = route.path;
      setFocus(autoFocus);
    }
  }, [route?.path, autoFocus, setFocus]);

  return {
    setFocus,
    focusMain,
    focusHeading,
    focusFirstInput,
  };
};

