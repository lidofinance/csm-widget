import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { useAccount, useCsmStatus } from 'shared/hooks';
import { useCsmEarlyAdoption } from 'shared/hooks/useCsmEarlyAdoption';

type Props = {
  fallback?: ReactNode;
};

export const GateLoaded: FC<PropsWithChildren<Props>> = ({
  fallback,
  children,
}) => {
  const { initialLoading: isStatusLoading } = useCsmStatus();
  const { isConnecting } = useAccount();
  const { isListLoading, active } = useNodeOperatorContext();
  const { initialLoading: isEaLoading } = useCsmEarlyAdoption();

  const loading =
    isStatusLoading ||
    isConnecting ||
    isListLoading ||
    (!active && isEaLoading);

  return <>{loading ? fallback : children}</>;
};
