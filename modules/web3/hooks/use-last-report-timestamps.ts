import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';
import { ReportTimestamps } from '@lidofinance/lido-csm-sdk';

export const useLastReportTimestamps = <TData = ReportTimestamps | null>(
  select?: (data: ReportTimestamps | null) => TData,
) => {
  const sdk = useSmSDK();

  return useQuery({
    queryKey: ['last-report-timestamps', { module: sdk?.core.moduleName }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(sdk);
      return (await sdk.rewards.getLastReportTimestamps()) ?? null;
    },
    enabled: !!sdk,
    select,
  });
};
