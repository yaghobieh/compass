import { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react';
import type { RouteContext } from '../../types';

type ParallelRoutesState = {
  slots: Record<string, RouteContext | null>;
};

type ParallelRoutesContextValue = {
  state: ParallelRoutesState;
  openSlot: (slot: string, route: RouteContext) => void;
  closeSlot: (slot: string) => void;
  isSlotOpen: (slot: string) => boolean;
};

const ParallelRoutesContext = createContext<ParallelRoutesContextValue | null>(null);

export const ParallelRoutesProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [state, setState] = useState<ParallelRoutesState>({ slots: {} });

  const openSlot = useCallback((slot: string, route: RouteContext) => {
    setState((prev) => ({
      slots: { ...prev.slots, [slot]: route },
    }));
  }, []);

  const closeSlot = useCallback((slot: string) => {
    setState((prev) => {
      const { [slot]: _, ...rest } = prev.slots;
      return { slots: rest };
    });
  }, []);

  const isSlotOpen = useCallback(
    (slot: string) => {
      return !!state.slots[slot];
    },
    [state.slots]
  );

  const value = useMemo(
    () => ({ state, openSlot, closeSlot, isSlotOpen }),
    [state, openSlot, closeSlot, isSlotOpen]
  );

  return (
    <ParallelRoutesContext.Provider value={value}>
      {children}
    </ParallelRoutesContext.Provider>
  );
};

export const useParallelRoutes = (): ParallelRoutesContextValue => {
  const context = useContext(ParallelRoutesContext);
  if (!context) {
    throw new Error('useParallelRoutes must be used within ParallelRoutesProvider');
  }
  return context;
};

export const ParallelOutlet = ({
  name,
  fallback,
}: {
  name: string;
  fallback?: ReactNode;
}): JSX.Element | null => {
  const { state } = useParallelRoutes();
  const slot = state.slots[name];

  if (!slot) {
    return fallback ? <>{fallback}</> : null;
  }

  return null;
};

export const useSlot = (name: string) => {
  const { state, openSlot, closeSlot, isSlotOpen } = useParallelRoutes();

  return {
    route: state.slots[name],
    isOpen: isSlotOpen(name),
    open: (route: RouteContext) => openSlot(name, route),
    close: () => closeSlot(name),
  };
};

