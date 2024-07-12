import { FC, PropsWithChildren, ReactNode } from 'react';
import { useCanCreateNodeOperator } from 'shared/hooks';

type Props = {
  fallback?: ReactNode;
};

export const GateCanCreate: FC<PropsWithChildren<Props>> = ({
  fallback,
  children,
}) => {
  const canCreate = useCanCreateNodeOperator();

  if (!canCreate) return fallback;

  return children;
};
