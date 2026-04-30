import { ShareLimitInfo } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from 'modules/web3';

export const KEY_SHARE_LIMIT = ['share-limit'];

export const useShareLimit = <TData = ShareLimitInfo>(
  select?: (data: ShareLimitInfo) => TData,
) => {
  const { module } = useSmSDK();

  return useQuery({
    queryKey: [...KEY_SHARE_LIMIT],
    ...STRATEGY_CONSTANT,
    queryFn: () => module.getShareLimit(),
    select,
  });
};
