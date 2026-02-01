import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from '../web3-provider';

export const useRewardsLastReportTxHash = () => {
  const { rewards } = useSmSDK();

  return useQuery({
    queryKey: ['rewards-last-report-tx-hash'],
    ...STRATEGY_CONSTANT,
    queryFn: () => rewards.getLastReportTransactionHash(),
  });
};
