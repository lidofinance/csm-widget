import {
  DEPOSIT_QUEUE_MODULES,
  DepositQueueBatch,
  MODULE_NAME,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { CsmFamilySDK, useTargetSmSDK } from '../web3-provider';

export const KEY_DEPOSIT_QUEUE_BATCHES = ['deposit-queue-batches'];

export const useDepositQueueBatches = <TData = DepositQueueBatch[][]>(
  select?: (data: DepositQueueBatch[][]) => TData,
  module?: MODULE_NAME,
) => {
  const { targetModule, sdk: moduleSdk } = useTargetSmSDK(module);
  const sdk = DEPOSIT_QUEUE_MODULES.has(targetModule)
    ? (moduleSdk as CsmFamilySDK | undefined)
    : undefined;

  return useQuery({
    queryKey: [...KEY_DEPOSIT_QUEUE_BATCHES, { module: targetModule }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return sdk.depositQueue.getAllBatches();
    },
    select,
    enabled: !!sdk,
  });
};
