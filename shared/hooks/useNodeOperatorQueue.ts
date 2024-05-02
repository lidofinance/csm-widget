import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_EAGER } from 'consts/swr-strategies';
import { useCSModuleRPC } from './useCsmContracts';

export const useNodeOperatorQueue = (config = STRATEGY_EAGER) => {
  return useContractSWR({
    contract: useCSModuleRPC(),
    method: 'queue',
    params: [],
    config,
  });
};
