import { FC, PropsWithChildren, ReactNode } from 'react';
import { useSiweAuth } from './siwe-auth-provider';

type SiweAuthGateProps = {
  fallback?: ReactNode;
};

export const SiweAuthGate: FC<PropsWithChildren<SiweAuthGateProps>> = ({
  fallback,
  children,
}) => {
  const { token } = useSiweAuth();
  const canShow = !!token;

  return <>{canShow ? children : fallback}</>;
};
