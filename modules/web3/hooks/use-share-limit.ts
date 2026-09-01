import { MODULE_NAME, ShareLimitInfo } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { isCsmFamilyModule, STRATEGY_CONSTANT } from 'consts';
import { useModule, useTargetSmSDK } from 'modules/web3';
import invariant from 'tiny-invariant';

export const KEY_SHARE_LIMIT = ['share-limit'];

export const useShareLimit = <TData = ShareLimitInfo>(
  select?: (data: ShareLimitInfo) => TData,
  module?: MODULE_NAME,
) => {
  const { module: activeModule } = useModule();
  const { targetModule, sdk: moduleSdk } = useTargetSmSDK(module);
  const sdk = module || isCsmFamilyModule(activeModule) ? moduleSdk : undefined;

  return useQuery({
    queryKey: [...KEY_SHARE_LIMIT, { module: targetModule }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return sdk.module.getShareLimit();
    },
    select,
    enabled: !!sdk,
  });
};
