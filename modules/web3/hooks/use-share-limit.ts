import { MODULE_NAME, ShareLimitInfo } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from 'modules/web3';
import invariant from 'tiny-invariant';

export const KEY_SHARE_LIMIT = ['share-limit'];

export const useShareLimit = <TData = ShareLimitInfo>(
  select?: (data: ShareLimitInfo) => TData,
) => {
  const sdk = useSmSDK(MODULE_NAME.CSM);

  return useQuery({
    queryKey: [...KEY_SHARE_LIMIT],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return sdk.module.getShareLimit();
    },
    select,
    enabled: !!sdk,
  });
};
