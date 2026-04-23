import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from '../web3-provider';
import { ReportTimestamps } from '@lidofinance/lido-csm-sdk';

export const useLastReportTimestamps = <TData = ReportTimestamps | undefined>(
  select?: (data: ReportTimestamps | undefined) => TData,
) => {
  const { rewards } = useSmSDK();

  return useQuery({
    queryKey: ['last-report-timestamps'],
    ...STRATEGY_CONSTANT,
    queryFn: () => rewards.getLastReportTimestamps(),
    select,
  });
};
