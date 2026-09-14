import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from '../web3-provider';
import { ReportTimestamps } from '@lidofinance/lido-csm-sdk';

export const useLastReportTimestamps = <TData = ReportTimestamps | null>(
  select?: (data: ReportTimestamps | null) => TData,
) => {
  const { rewards, core } = useSmSDK();

  return useQuery({
    queryKey: ['last-report-timestamps', { module: core.moduleName }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => (await rewards.getLastReportTimestamps()) ?? null,
    select,
  });
};
