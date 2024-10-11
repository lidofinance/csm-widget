import { useActiveNodeOperator } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { useCanCreateNodeOperator } from 'shared/hooks';

type Props = {
  fallback?: ReactNode;
};

export const GateCanCreate: FC<PropsWithChildren<Props>> = ({
  fallback,
  children,
}) => {
  const nodeOperator = useActiveNodeOperator();
  const canCreate = useCanCreateNodeOperator();

  return <>{!(canCreate && !nodeOperator) ? fallback : children}</>;
};
