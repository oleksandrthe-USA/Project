import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user } = useAuth();

  if (!user) {
    return <AuthModal mode="login" />;
  }

  return <>{children}</>;
}
