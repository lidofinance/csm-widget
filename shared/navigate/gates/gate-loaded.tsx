import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { useAccount, useCsmPaused, useCsmPublicRelease } from 'shared/hooks';
import { useCsmEarlyAdoption } from 'shared/hooks/useCsmEarlyAdoption';
import { SplashPage } from '../splash';
// DAPPNODE
import { useECSanityCheck } from 'dappnode/hooks/use-ec-sanity-check';
import { ECNotInstalledPage } from 'dappnode/fallbacks/ec-not-installed-page';
import { ECNoLogsPage } from 'dappnode/fallbacks/ec-no-logs-page';
import { ECSyncingPage } from 'dappnode/fallbacks/ec-syncing-page';
import { ECScanningPage } from 'dappnode/fallbacks/ec-scanning-events';

type Props = {
  fallback?: ReactNode;
  additional?: boolean;
};

export const GateLoaded: FC<PropsWithChildren<Props>> = ({
  fallback,
  additional,
  children,
}) => {
  const { initialLoading: isPublicReleaseLoading } = useCsmPublicRelease();
  const { initialLoading: isPausedLoading } = useCsmPaused();
  const { isConnecting } = useAccount();
  const { isListLoading, active } = useNodeOperatorContext();
  const { initialLoading: isEaLoading } = useCsmEarlyAdoption();
  // DAPPNODE
  const {
    isInstalled,
    isLoading: isECLoading,
    isSynced,
    hasLogs,
  } = useECSanityCheck();

  const loading =
    isPublicReleaseLoading ||
    isPausedLoading ||
    isConnecting ||
    isListLoading ||
    (!active && isEaLoading) ||
    isECLoading; // DAPPNODE

  // DAPPNODE
  isECLoading ? (
    <SplashPage />
  ) : !isInstalled ? (
    <ECNotInstalledPage />
  ) : !isSynced ? (
    <ECSyncingPage />
  ) : !hasLogs ? (
    <ECNoLogsPage />
  ) : isListLoading ? (
    <ECScanningPage />
  ) : (
    <SplashPage />
  );

  // DAPPNODE
  return (
    <>
      {loading || !isInstalled || !isSynced || !hasLogs || additional
        ? fallback
        : children}
    </>
  );
};
