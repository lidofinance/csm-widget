import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { useAccount, useCsmPaused, useCsmPublicRelease } from 'shared/hooks';
import { useCsmEarlyAdoption } from 'shared/hooks/useCsmEarlyAdoption';
import { SplashPage } from '../splash';

type Props = {
  fallback?: ReactNode;
  additional?: boolean;
};

export const GateLoaded: FC<PropsWithChildren<Props>> = ({
  fallback = <SplashPage />,
  additional,
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

  return <>{loading || additional ? fallback : children}</>;
};
