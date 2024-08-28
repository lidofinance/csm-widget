import { useActiveNodeOperator } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';

type Props = {
  fallback?: ReactNode;
};

export const GateNodeOperator: FC<PropsWithChildren<Props>> = ({
  fallback,
  children,
}) => {
  const nodeOperator = useActiveNodeOperator();

  return <>{!nodeOperator ? fallback : children}</>;
};
