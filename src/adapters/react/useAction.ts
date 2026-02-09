import { useState, useCallback, useRef } from 'react';
import { useRoute, useNavigate } from './CompassContext';
import type { ActionFn, ActionContext, ActionResult } from '../../types';

type UseActionOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  redirectTo?: string;
  revalidate?: boolean;
};

type UseActionReturn<T> = ActionResult<T> & {
  submit: (formDataOrEvent?: FormData | React.FormEvent) => Promise<void>;
  reset: () => void;
  isSubmitting: boolean;
};

export const useAction = <T = unknown>(
  action?: ActionFn<T>,
  options: UseActionOptions<T> = {}
): UseActionReturn<T> => {
  const route = useRoute();
  const { navigate } = useNavigate();
  const { onSuccess, onError, redirectTo } = options;

  const [state, setState] = useState<ActionResult<T>>({
    data: undefined,
    error: undefined,
    status: 'idle',
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const submit = useCallback(
    async (formDataOrEvent?: FormData | React.FormEvent) => {
      if (!route || !action) return;

      let formData: FormData;

      if (formDataOrEvent instanceof FormData) {
        formData = formDataOrEvent;
      } else if (formDataOrEvent && 'preventDefault' in formDataOrEvent) {
        formDataOrEvent.preventDefault();
        const form = formDataOrEvent.target as HTMLFormElement;
        formData = new FormData(form);
      } else {
        formData = new FormData();
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const context: ActionContext = {
        params: route.params,
        request: new Request(window.location.href, {
          method: 'POST',
          body: formData,
        }),
        formData,
      };

      setState({ data: undefined, error: undefined, status: 'submitting' });

      try {
        const data = await Promise.resolve(action(context));
        setState({ data, error: undefined, status: 'success' });
        onSuccess?.(data);

        if (redirectTo) {
          navigate(redirectTo);
        }
      } catch (error) {
        setState({ data: undefined, error: error as Error, status: 'error' });
        onError?.(error as Error);
      }
    },
    [route, action, onSuccess, onError, redirectTo, navigate]
  );

  const reset = useCallback(() => {
    setState({ data: undefined, error: undefined, status: 'idle' });
  }, []);

  return {
    ...state,
    submit,
    reset,
    isSubmitting: state.status === 'submitting',
  };
};

export const createAction = <T>(action: ActionFn<T>): ActionFn<T> => action;

