import { useEffect, useState, useCallback } from 'react';
import { useRoute } from './CompassContext';
import type { Guard, GuardResult } from '../../types';

type UseGuardReturn = {
  isChecking: boolean;
  isAllowed: boolean;
  result: GuardResult | null;
  recheck: () => void;
};

export const useGuard = (guard: Guard): UseGuardReturn => {
  const route = useRoute();
  const [isChecking, setIsChecking] = useState(true);
  const [result, setResult] = useState<GuardResult | null>(null);

  const checkGuard = useCallback(async () => {
    if (!route) {
      setResult({ allowed: false, reason: 'No route context' });
      setIsChecking(false);
      return;
    }

    setIsChecking(true);

    try {
      const guardResult = await Promise.resolve(guard.check(route));
      setResult(guardResult);
    } catch (error) {
      setResult({ allowed: false, reason: String(error) });
    } finally {
      setIsChecking(false);
    }
  }, [guard, route]);

  useEffect(() => {
    checkGuard();
  }, [checkGuard]);

  return {
    isChecking,
    isAllowed: result?.allowed ?? false,
    result,
    recheck: checkGuard,
  };
};

