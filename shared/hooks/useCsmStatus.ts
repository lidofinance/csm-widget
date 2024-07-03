import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useCallback } from 'react';
import { getSettledValue } from 'utils';
import { useAccount } from './use-account';
import { useCSModuleRPC } from './useCsmContracts';

export const useCsmStatus = (config = STRATEGY_CONSTANT) => {
  const { chainId } = useAccount();
  const contract = useCSModuleRPC();

  const fetcher = useCallback(async () => {
    const [isPausedResult, isPublicReleaseResult] = await Promise.allSettled([
      contract.isPaused(),
      contract.publicRelease(),
    ]);

    const isPaused = getSettledValue(isPausedResult);
    const isPublicRelease = getSettledValue(isPublicReleaseResult);
    const isEarlyAdoption =
      isPublicRelease !== undefined ? !isPublicRelease : undefined;
    const isUnavailable = [isPaused, isPublicRelease].includes(undefined);

    return {
      isPaused,
      isPublicRelease,
      isEarlyAdoption,
      isUnavailable,
    };
  }, [contract]);

  return useLidoSWR(['csm-status', chainId], fetcher, config);
};
