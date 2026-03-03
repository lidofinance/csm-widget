import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from '../web3-provider';

export const useLastReportTimestamps = () => {
  const { rewards } = useSmSDK();

  return useQuery({
    queryKey: ['last-report-timestamps'],
    ...STRATEGY_CONSTANT,
    queryFn: () => rewards.getLastReportTimestamps(),
  });
};
