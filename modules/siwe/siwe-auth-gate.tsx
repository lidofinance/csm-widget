import { FC, PropsWithChildren, ReactNode } from 'react';
import { useSiweAuth } from './use-siwe-auth';

type SiweAuthGateProps = {
  fallback?: ReactNode;
};

export const SiweAuthGate: FC<PropsWithChildren<SiweAuthGateProps>> = ({
  fallback,
  children,
}) => {
  const { token } = useSiweAuth();
  return <>{token ? children : fallback}</>;
};
