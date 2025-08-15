import { ShareLimitInfo } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from 'modules/web3';

export const useShareLimit = <TData = ShareLimitInfo>(
  select?: (data: ShareLimitInfo) => TData,
) => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['share-limit'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.module.getShareLimit(),
    select,
  });
};
