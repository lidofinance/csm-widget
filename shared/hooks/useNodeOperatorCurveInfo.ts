import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { NodeOperatorId } from 'types';
import { useCSAccountingRPC } from './useCsmContracts';

export const useNodeOperatorCurveInfo = (
  nodeOperatorId?: NodeOperatorId,
  config = STRATEGY_CONSTANT,
) => {
  return useContractSWR({
    contract: useCSAccountingRPC(),
    method: 'getBondCurve',
    params: [nodeOperatorId],
    shouldFetch: !!nodeOperatorId,
    config,
  });
};
