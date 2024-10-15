import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { useAccount, useCsmPaused, useCsmPublicRelease } from 'shared/hooks';
import { useCsmEarlyAdoption } from 'shared/hooks/useCsmEarlyAdoption';

type Props = {
  fallback?: ReactNode;
};

export const GateLoaded: FC<PropsWithChildren<Props>> = ({
  fallback,
  children,
}) => {
  const { initialLoading: isPublicReleaseLoading } = useCsmPublicRelease();
  const { initialLoading: isPausedLoading } = useCsmPaused();
  const { isConnecting } = useAccount();
  const { isListLoading, active } = useNodeOperatorContext();
  const { initialLoading: isEaLoading } = useCsmEarlyAdoption();

  const loading =
    isPublicReleaseLoading ||
    isPausedLoading ||
    isConnecting ||
    isListLoading ||
    (!active && isEaLoading);

  return <>{loading ? fallback : children}</>;
};
