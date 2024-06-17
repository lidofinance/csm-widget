import { useNodeOperator } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { useCsmStatus } from 'shared/hooks';
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
  const { initialLoading: isStatusLoading } = useCsmStatus();

  if (isListLoading || initialLoading || isStatusLoading) return fallback;

  return children;
};
