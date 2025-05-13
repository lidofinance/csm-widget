import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { useAccount } from './use-account';
import { useCsmEarlyAdoption } from './useCsmEarlyAdoption';
import { useCsmPaused, useCsmPublicRelease } from './useCsmStatus';
import { useEffect, useState } from 'react';

export const useInitialLoading = (externalLoading?: boolean) => {
  const { initialLoading: isPublicReleaseLoading } = useCsmPublicRelease();
  const { initialLoading: isPausedLoading } = useCsmPaused();
  const { isConnecting } = useAccount();
  const { isListLoading, active } = useNodeOperatorContext();
  const { initialLoading: isEaLoading } = useCsmEarlyAdoption();

  const [state, setState] = useState(true);

  useEffect(() => {
    const loading =
      isPublicReleaseLoading ||
      isPausedLoading ||
      isConnecting ||
      isListLoading ||
      (!active && isEaLoading);

    const result = Boolean(loading || externalLoading);
    setState(result);
  }, [
    active,
    externalLoading,
    isConnecting,
    isEaLoading,
    isListLoading,
    isPausedLoading,
    isPublicReleaseLoading,
  ]);

  return state;
};
