import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { NodeOperatorId } from 'types';
import { useCSAccountingRPC } from './useCsmContracts';

export const useNodeOperatorLockAmount = (
  nodeOperatorId?: NodeOperatorId,
  config = STRATEGY_LAZY,
) => {
  return useContractSWR({
    contract: useCSAccountingRPC(),
    method: 'getActualLockedBond',
    params: [nodeOperatorId],
    shouldFetch: !!nodeOperatorId,
    config,
  });
};
