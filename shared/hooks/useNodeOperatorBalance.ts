import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_EAGER } from 'consts/swr-strategies';
import { NodeOperatorId } from 'types';
import { useCSAccountingRPC } from './useCsmContracts';
import { useExtendedBondBalance } from './useExtendedBondBalance';
import { useMergeSwr } from './useMergeSwr';

export const useNodeOperatorBalance = (
  nodeOperatorId?: NodeOperatorId,
  config = STRATEGY_EAGER,
) => {
  const swr = useContractSWR({
    contract: useCSAccountingRPC(),
    method: 'getBondSummary',
    params: [nodeOperatorId],
    shouldFetch: !!nodeOperatorId,
    config,
  });

  const balance = useExtendedBondBalance(swr.data?.required, swr.data?.current);

  return useMergeSwr([swr], balance);
};
