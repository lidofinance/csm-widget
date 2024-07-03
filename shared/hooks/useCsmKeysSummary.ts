import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useCSModuleRPC } from './useCsmContracts';

export const useCsmKeysSummary = (config = STRATEGY_LAZY) => {
  return useContractSWR({
    contract: useCSModuleRPC(),
    method: 'getStakingModuleSummary',
    params: [],
    config,
  });
};
