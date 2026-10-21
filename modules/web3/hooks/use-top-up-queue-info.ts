import {
  MODULE_NAME,
  TOPUP_QUEUE_MODULES,
  TopUpQueueInfo,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { CsmFamilySDK, useTargetSmSDK } from '../web3-provider';

export const KEY_TOP_UP_QUEUE_INFO = ['top-up-queue-info'];

export const useTopUpQueueInfo = <TData = TopUpQueueInfo>(
  select?: (data: TopUpQueueInfo) => TData,
  module?: MODULE_NAME,
) => {
  const { targetModule, sdk: moduleSdk } = useTargetSmSDK(module);
  const sdk = TOPUP_QUEUE_MODULES.has(targetModule)
    ? (moduleSdk as CsmFamilySDK | undefined)
    : undefined;

  return useQuery({
    queryKey: [...KEY_TOP_UP_QUEUE_INFO, { module: targetModule }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return sdk.depositQueue.getTopUpQueueInfo();
    },
    select,
    enabled: !!sdk,
  });
};
