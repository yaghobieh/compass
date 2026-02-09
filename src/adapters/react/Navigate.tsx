import { useEffect } from 'react';
import { useNavigate } from './CompassContext';

export type NavigateProps = {
  to: string;
  replace?: boolean;
  state?: unknown;
};

export const Navigate = ({ to, replace = false, state }: NavigateProps): null => {
  const { navigate } = useNavigate();

  useEffect(() => {
    navigate(to, { replace, state });
  }, [navigate, to, replace, state]);

  return null;
};

