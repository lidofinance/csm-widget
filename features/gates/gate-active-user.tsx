import { FC, PropsWithChildren, ReactNode } from 'react';
import { useAccount } from 'shared/hooks';

type Props = {
  fallback?: ReactNode;
};

export const GateActiveUser: FC<PropsWithChildren<Props>> = ({
  fallback,
  children,
}) => {
  const { active } = useAccount();

  if (!active) return fallback;

  return children;
};
