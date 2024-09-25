import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useCSModuleRPC } from './useCsmContracts';

export const useNodeOperatorsCount = (config = STRATEGY_LAZY) => {
  return useContractSWR({
    contract: useCSModuleRPC(),
    method: 'getNodeOperatorsCount',
    params: [],
    config,
  });
};
