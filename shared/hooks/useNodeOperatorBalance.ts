import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_EAGER } from 'consts/swr-strategies';
import { NodeOperatorId } from 'types';
import { useCSAccountingRPC } from './useCsmContracts';
import { useExtendedBondBalance } from './useExtendedBondBalance';

export const useNodeOperatorBalance = (
  nodeOperatorId?: NodeOperatorId,
  config = STRATEGY_EAGER,
) => {
  const { data, ...swr } = useContractSWR({
    contract: useCSAccountingRPC(),
    method: 'getBondSummary',
    params: [nodeOperatorId],
    shouldFetch: !!nodeOperatorId,
    config,
  });

  const balance = useExtendedBondBalance(data?.required, data?.current);

  return {
    ...swr,
    data: balance,
  };
};
