import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, STRATEGY_LAZY } from 'consts';
import { standardFetcher } from 'utils';
import { WrappedStats, WrappedStatsResponse } from './types';

export const useWrappedApi = (nodeOperatorId?: NodeOperatorId) => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin;
  const url = `${BASE_URL}/${API_ROUTES.WRAPPED}?node-operator-id=${nodeOperatorId}`;

  return useQuery<WrappedStatsResponse, Error, WrappedStats | null>({
    queryKey: ['wrapped', { nodeOperatorId }],
    queryFn: async () => standardFetcher<WrappedStatsResponse>(url),
    select: (data) =>
      data &&
      ({
        ...data,
        totalRewardsETH: BigInt(data.totalRewardsETH),
        avgPerformance: BigInt(data.avgPerformance),
        bestMonthPerformance: BigInt(data.bestMonthPerformance),
      } as WrappedStats),
    enabled: nodeOperatorId !== undefined,
    ...STRATEGY_LAZY,
  });
};
