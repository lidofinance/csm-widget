import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { useCSModuleRPC } from './useCsmContracts';

export const useCsmEarlyAdoptionKeysLimit = (config = STRATEGY_IMMUTABLE) => {
  return useContractSWR({
    contract: useCSModuleRPC(),
    method: 'MAX_SIGNING_KEYS_PER_OPERATOR_BEFORE_PUBLIC_RELEASE',
    params: [],
    config,
  });
};
