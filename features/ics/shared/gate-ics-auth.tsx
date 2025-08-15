import { FC, PropsWithChildren, ReactNode } from 'react';
import { useAuth } from './ics-auth-provider';

type GateProps = {
  fallback?: ReactNode;
};

export const GateIcsAuth: FC<PropsWithChildren<GateProps>> = ({
  fallback,
  children,
}) => {
  const { token } = useAuth();
  const canShow = !!token;

  return <>{canShow ? children : fallback}</>;
};
