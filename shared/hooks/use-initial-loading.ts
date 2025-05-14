import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { useAccount } from './use-account';
import { useCsmEarlyAdoption } from './useCsmEarlyAdoption';
import { useCsmPaused, useCsmPublicRelease } from './useCsmStatus';
import { useEffect, useState } from 'react';
import { useCsmVersionSupported } from './use-csm-version-supported';

type ReturnProps = { isLoading: boolean; isSupported: boolean };

export const useInitialLoading = (externalLoading?: boolean) => {
  const { initialLoading: isPublicReleaseLoading } = useCsmPublicRelease();
  const { initialLoading: isPausedLoading } = useCsmPaused();
  const { isConnecting } = useAccount();
  const { isListLoading, active } = useNodeOperatorContext();
  const { initialLoading: isEaLoading } = useCsmEarlyAdoption();
  const { initialLoading: isSupporetdLoading, data: isSupported } =
    useCsmVersionSupported();

  const [state, setState] = useState<ReturnProps>({
    isLoading: true,
    isSupported: true,
  });

  useEffect(() => {
    const isLoading = Boolean(
      isSupporetdLoading ||
        isPublicReleaseLoading ||
        isPausedLoading ||
        isConnecting ||
        isListLoading ||
        (!active && isEaLoading) ||
        externalLoading,
    );

    setState({ isLoading, isSupported: isSupported ?? true });
  }, [
    active,
    externalLoading,
    isConnecting,
    isEaLoading,
    isListLoading,
    isPausedLoading,
    isPublicReleaseLoading,
    isSupporetdLoading,
    isSupported,
  ]);

  return state;
};
