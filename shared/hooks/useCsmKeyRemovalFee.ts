import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useCSModuleRPC } from 'shared/hooks';

export const useCsmKeyRemovalFee = (config = STRATEGY_CONSTANT) => {
  return useContractSWR({
    contract: useCSModuleRPC(),
    method: 'keyRemovalCharge',
    params: [],
    config,
  });
};
