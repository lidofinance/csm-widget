import { NodeOperatorId } from 'types';
import { useCSModuleRPC } from './useCsmContracts';
import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_EAGER } from 'consts/swr-strategies';

export const useNodeOperatorSummary = (
  nodeOperatorId?: NodeOperatorId,
  config = STRATEGY_EAGER,
) => {
  return useContractSWR({
    contract: useCSModuleRPC(),
    method: 'getNodeOperatorSummary',
    params: [nodeOperatorId],
    shouldFetch: !!nodeOperatorId,
    config,
  });
};
