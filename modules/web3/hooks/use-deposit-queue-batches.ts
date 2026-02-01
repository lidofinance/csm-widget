import { DepositQueueBatch } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { MODULE, STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_DEPOSIT_QUEUE_BATCHES = ['deposit-queue-batches'];

export const useDepositQueueBatches = <TData = DepositQueueBatch[][]>(
  select?: (data: DepositQueueBatch[][]) => TData,
) => {
  const sdk = useSmSDK(MODULE.CSM);

  return useQuery({
    queryKey: [...KEY_DEPOSIT_QUEUE_BATCHES],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return sdk.depositQueue.getAllBatches();
    },
    select,
    enabled: !!sdk,
  });
};
