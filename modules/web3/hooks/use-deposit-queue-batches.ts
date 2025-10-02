import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';
import { DepositQueueBatch } from '@lidofinance/lido-csm-sdk';

export const KEY_DEPOSIT_QUEUE_BATCHES = ['deposit-queue-batches'];

export const useDepositQueueBatches = <TData = DepositQueueBatch[][]>(
  select?: (data: DepositQueueBatch[][]) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: [...KEY_DEPOSIT_QUEUE_BATCHES],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.depositQueue.getAllBatches(),
    select,
  });
};
