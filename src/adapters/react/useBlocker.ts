import { useState, useCallback, useEffect, useRef } from 'react';
import type { BlockerState, BlockerFn } from '../../types';

type UseBlockerReturn = {
  state: BlockerState;
  block: (message?: string | BlockerFn) => void;
  unblock: () => void;
  isBlocking: boolean;
};

export const useBlocker = (
  shouldBlock?: boolean | BlockerFn,
  message?: string
): UseBlockerReturn => {
  const [isBlocking, setIsBlocking] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<{
    path: string;
    resolve: (proceed: boolean) => void;
  } | null>(null);
  
  const blockerRef = useRef<BlockerFn | null>(null);
  const messageRef = useRef<string | undefined>(message);

  const block = useCallback((msgOrFn?: string | BlockerFn) => {
    if (typeof msgOrFn === 'function') {
      blockerRef.current = msgOrFn;
    } else {
      messageRef.current = msgOrFn;
      blockerRef.current = () => true;
    }
    setIsBlocking(true);
  }, []);

  const unblock = useCallback(() => {
    blockerRef.current = null;
    setIsBlocking(false);
  }, []);

  const proceed = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation.resolve(true);
      setPendingNavigation(null);
    }
  }, [pendingNavigation]);

  const cancel = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation.resolve(false);
      setPendingNavigation(null);
    }
  }, [pendingNavigation]);

  useEffect(() => {
    if (shouldBlock !== undefined) {
      if (typeof shouldBlock === 'function') {
        blockerRef.current = shouldBlock;
        setIsBlocking(true);
      } else if (shouldBlock) {
        blockerRef.current = () => true;
        messageRef.current = message;
        setIsBlocking(true);
      } else {
        blockerRef.current = null;
        setIsBlocking(false);
      }
    }
  }, [shouldBlock, message]);

  useEffect(() => {
    if (!isBlocking) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (blockerRef.current) {
        e.preventDefault();
        e.returnValue = messageRef.current || '';
        return messageRef.current || '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isBlocking]);

  const state: BlockerState = {
    isBlocked: pendingNavigation !== null,
    proceed,
    cancel,
    message: messageRef.current,
  };

  return {
    state,
    block,
    unblock,
    isBlocking,
  };
};

