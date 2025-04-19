import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AnimatedLinkProps {
  to: string;
  children: ReactNode;
}

export function AnimatedLink({ to, children }: AnimatedLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        relative
        px-2
        py-1
        transition-colors
        duration-300
        hover:text-primary
        ${isActive ? 'text-primary' : 'text-foreground'}
        before:absolute
        before:left-0
        before:bottom-0
        before:h-[2px]
        before:w-0
        before:bg-primary
        before:transition-all
        before:duration-300
        hover:before:w-full
      `}
    >
      {children}
    </Link>
  );
}
