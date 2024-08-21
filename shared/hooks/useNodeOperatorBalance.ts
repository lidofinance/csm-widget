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
  const swrBalance = useContractSWR({
    contract: useCSAccountingRPC(),
    method: 'getBondSummary',
    params: [nodeOperatorId],
    shouldFetch: !!nodeOperatorId,
    config,
  });

  const swrLocked = useContractSWR({
    contract: useCSAccountingRPC(),
    method: 'getActualLockedBond',
    params: [nodeOperatorId],
    shouldFetch: !!nodeOperatorId,
    config,
  });

  const balance = useExtendedBondBalance(
    swrBalance.data?.required,
    swrBalance.data?.current,
    swrLocked.data,
  );

  return useMergeSwr([swrBalance, swrLocked], balance);
};
