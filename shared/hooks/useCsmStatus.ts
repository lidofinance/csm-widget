import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useCallback } from 'react';
import { getSettledValue } from 'utils';
import { useAccount } from './use-account';
import { useCSAccountingRPC, useCSModuleRPC } from './useCsmContracts';

export const useCsmStatus = (config = STRATEGY_CONSTANT) => {
  const { chainId } = useAccount();
  const CSModule = useCSModuleRPC();
  const CSAccounting = useCSAccountingRPC();

  const fetcher = useCallback(async () => {
    const [isPausedResult, isAccountingPausedResult, isPublicReleaseResult] =
      await Promise.allSettled([
        CSModule.isPaused(),
        CSAccounting.isPaused(),
        CSModule.publicRelease(),
      ]);

    const isPaused = getSettledValue(isPausedResult);
    const isAccountingPaused = getSettledValue(isAccountingPausedResult);
    const isPublicRelease = getSettledValue(isPublicReleaseResult);
    const isEarlyAdoption =
      isPublicRelease !== undefined ? !isPublicRelease : undefined;
    const isUnavailable = [isPaused, isPublicRelease].includes(undefined);

    return {
      isPaused,
      isAccountingPaused,
      isPublicRelease,
      isEarlyAdoption,
      isUnavailable,
    };
  }, [CSAccounting, CSModule]);

  return useLidoSWR(['csm-status', chainId], fetcher, config);
};
