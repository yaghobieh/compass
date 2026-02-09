import { useCallback, useMemo } from 'react';
import type { ReactNode, MouseEvent, AnchorHTMLAttributes } from 'react';
import { useRouter } from './CompassContext';

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
  replace?: boolean;
  state?: unknown;
  children?: ReactNode;
  prefetch?: boolean;
};

export const Link = ({
  to,
  replace = false,
  state,
  children,
  onClick,
  prefetch,
  ...rest
}: LinkProps): JSX.Element => {
  const router = useRouter();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        onClick(e);
      }

      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
      if (rest.target === '_blank') return;

      e.preventDefault();
      router.navigate(to, { replace, state });
    },
    [router, to, replace, state, onClick, rest.target]
  );

  const href = useMemo(() => {
    return to.startsWith('/') ? to : `/${to}`;
  }, [to]);

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

