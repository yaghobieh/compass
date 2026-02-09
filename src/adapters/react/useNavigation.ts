import { useMemo } from 'react';
import { useCompassContext } from './CompassContext';
import type { NavigationState } from '../../types';

type UseNavigationReturn = NavigationState & {
  isIdle: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
};

export const useNavigation = (): UseNavigationReturn => {
  const { state } = useCompassContext();

  return useMemo(() => {
    const navigationState: NavigationState = {
      state: state.isNavigating ? 'loading' : 'idle',
      location: state.currentRoute || undefined,
    };

    return {
      ...navigationState,
      isIdle: !state.isNavigating && !state.isLoading,
      isLoading: state.isNavigating || state.isLoading,
      isSubmitting: false,
    };
  }, [state.isNavigating, state.isLoading, state.currentRoute]);
};

export const usePendingLocation = () => {
  const { state } = useCompassContext();
  return state.isNavigating ? state.currentRoute : null;
};

