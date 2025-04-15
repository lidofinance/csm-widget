import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { useAccount } from './use-account';
import { useCsmEarlyAdoption } from './useCsmEarlyAdoption';
import { useCsmPaused, useCsmPublicRelease } from './useCsmStatus';

export const useInitialLoading = (externalLoading?: boolean) => {
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

  return loading || externalLoading;
};
