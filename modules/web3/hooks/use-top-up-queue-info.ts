import {
  MODULE_NAME,
  MODULE_PROFILE,
  TopUpQueueInfo,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { CsmFamilySDK, useTargetSmSDK } from '../web3-provider';

export const KEY_TOP_UP_QUEUE_INFO = ['top-up-queue-info'];

export const useTopUpQueueInfo = <TData = TopUpQueueInfo>({
  module,
  select,
}: {
  module?: MODULE_NAME;
  select?: (data: TopUpQueueInfo) => TData;
} = {}) => {
  const { targetModule, sdk: moduleSdk } = useTargetSmSDK(module);
  const sdk =
    targetModule && MODULE_PROFILE[targetModule].topUpQueue
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
