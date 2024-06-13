import { useNodeOperator } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { useCsmEarlyAdoption } from 'shared/hooks/useCsmEarlyAdoption';

type Props = {
  fallback?: ReactNode;
};

export const GateLoaded: FC<PropsWithChildren<Props>> = ({
  fallback,
  children,
}) => {
  const { isListLoading } = useNodeOperator();
  const { initialLoading } = useCsmEarlyAdoption();

  if (isListLoading || initialLoading) return fallback;

  return children;
};
