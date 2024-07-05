import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { useCSModuleRPC } from 'shared/hooks';

export const useCsmKeyRemovalFee = (config = STRATEGY_IMMUTABLE) => {
  return useContractSWR({
    contract: useCSModuleRPC(),
    method: 'keyRemovalCharge',
    params: [],
    config,
  });
};
