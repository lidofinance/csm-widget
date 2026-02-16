import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';

export const useLastReportTxHash = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['last-report-tx-hash'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.rewards.getLastReportTransactionHash(),
  });
};
