import { useMemo } from 'react';
import { Link, type LinkProps } from './Link';
import { useRoute } from './CompassContext';

export type NavLinkProps = LinkProps & {
  activeClassName?: string;
  exactActiveClassName?: string;
  exact?: boolean;
};

export const NavLink = ({
  to,
  className,
  activeClassName = 'active',
  exactActiveClassName = 'exact-active',
  exact = false,
  ...rest
}: NavLinkProps): JSX.Element => {
  const route = useRoute();

  const { isActive, isExactActive } = useMemo(() => {
    if (!route) return { isActive: false, isExactActive: false };

    const currentPath = route.path;
    const targetPath = to.startsWith('/') ? to : `/${to}`;

    const exactMatch = currentPath === targetPath;
    const prefixMatch = currentPath.startsWith(targetPath);

    return {
      isActive: prefixMatch,
      isExactActive: exactMatch,
    };
  }, [route, to]);

  const computedClassName = useMemo(() => {
    const classes: string[] = [];

    if (className) {
      classes.push(typeof className === 'string' ? className : '');
    }

    if (isActive && !exact) {
      classes.push(activeClassName);
    }

    if (isExactActive) {
      classes.push(exactActiveClassName);
    }

    return classes.filter(Boolean).join(' ');
  }, [className, isActive, isExactActive, activeClassName, exactActiveClassName, exact]);

  return <Link to={to} className={computedClassName} {...rest} />;
};

