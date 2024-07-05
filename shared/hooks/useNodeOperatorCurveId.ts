import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { NodeOperatorId } from 'types';
import { useCSAccountingRPC } from './useCsmContracts';

export const useNodeOperatorCurveId = (
  nodeOperatorId?: NodeOperatorId,
  config = STRATEGY_IMMUTABLE,
) => {
  return useContractSWR({
    contract: useCSAccountingRPC(),
    method: 'getBondCurveId',
    params: [nodeOperatorId],
    shouldFetch: !!nodeOperatorId,
    config,
  });
};
