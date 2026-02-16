import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useLidoSDK } from '../web3-provider';

export const useLastReportTimestamps = () => {
  const { csm } = useLidoSDK();

  return useQuery({
    queryKey: ['last-report-timestamps'],
    ...STRATEGY_CONSTANT,
    queryFn: () => csm.rewards.getLastReportTimestamps(),
  });
};
