import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from '../web3-provider';

export const useRewardsLastReportTxHash = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['rewards-last-report-tx-hash'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.rewards.getLastReportTransactionHash(),
  });
};
