import { DepositQueueBatch, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { CsmFamilySDK, useSmSDK, useSmSDKByModule } from '../web3-provider';

export const KEY_DEPOSIT_QUEUE_BATCHES = ['deposit-queue-batches'];

export const useDepositQueueBatches = <TData = DepositQueueBatch[][]>(
  select?: (data: DepositQueueBatch[][]) => TData,
  module?: MODULE_NAME,
) => {
  const activeModule = useSmSDK().core.moduleName;
  const targetModule = module ?? activeModule;
  const byModuleSdk = useSmSDKByModule(targetModule) as
    CsmFamilySDK | undefined;
  const isCsmFamily =
    targetModule === MODULE_NAME.CSM || targetModule === MODULE_NAME.CSM_02;
  const sdk = isCsmFamily ? byModuleSdk : undefined;

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
