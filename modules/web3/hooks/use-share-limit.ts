import { MODULE_NAME, ShareLimitInfo } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK, useSmSDKByModule } from 'modules/web3';
import invariant from 'tiny-invariant';

export const KEY_SHARE_LIMIT = ['share-limit'];

export const useShareLimit = <TData = ShareLimitInfo>(
  select?: (data: ShareLimitInfo) => TData,
  module?: MODULE_NAME,
) => {
  const activeModule = useSmSDK().core.moduleName;
  const targetModule = module ?? activeModule;
  const byModuleSdk = useSmSDKByModule(targetModule);
  const isCsmFamily =
    activeModule === MODULE_NAME.CSM || activeModule === MODULE_NAME.CSM_02;
  const sdk = module || isCsmFamily ? byModuleSdk : undefined;

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
