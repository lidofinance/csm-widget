import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useMemo } from 'react';
import { useCSAccountingRPC, useCSModuleRPC } from './useCsmContracts';
import { useMergeSwr } from './useMergeSwr';

export const useCsmPaused = (config = STRATEGY_CONSTANT) => {
  const swrModulePaused = useContractSWR({
    contract: useCSModuleRPC(),
    method: 'isPaused',
    config,
  });

  const swrAccountingPaused = useContractSWR({
    contract: useCSAccountingRPC(),
    method: 'isPaused',
    config,
  });

  const result = useMemo(
    () => ({
      isPaused: swrModulePaused.data,
      isAccountingPaused: swrAccountingPaused.data,
    }),
    [swrAccountingPaused.data, swrModulePaused.data],
  );

  return useMergeSwr([swrModulePaused, swrAccountingPaused], result);
};
