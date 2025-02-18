import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { useAccount, useCsmPaused, useCsmPublicRelease } from 'shared/hooks';
import { useCsmEarlyAdoption } from 'shared/hooks/useCsmEarlyAdoption';
import { SplashPage } from '../splash';
import { ECScanningPage } from 'dappnode/fallbacks/ec-scanning-events';

type Props = {
  fallback?: ReactNode;
  additional?: boolean;
};

export const GateLoaded: FC<PropsWithChildren<Props>> = ({
  additional,
  children,
}) => {
  const { initialLoading: isPublicReleaseLoading } = useCsmPublicRelease();
  const { initialLoading: isPausedLoading } = useCsmPaused();
  const { isConnecting } = useAccount();
  const { isListLoading, active } = useNodeOperatorContext();
  const { initialLoading: isEaLoading } = useCsmEarlyAdoption();

  // DAPPNODE
  const fallback = isListLoading ? <ECScanningPage /> : <SplashPage />;

  const loading =
    isPublicReleaseLoading ||
    isPausedLoading ||
    isConnecting ||
    isListLoading ||
    (!active && isEaLoading);

  return <>{loading || additional ? fallback : children}</>;
};
