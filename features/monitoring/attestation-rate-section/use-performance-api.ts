import { NodeOperatorId, PERCENT_BASIS } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, STRATEGY_LAZY } from 'consts';
import { useNodeOperatorId } from 'modules/web3';
import { Performance, RateStatus, UnifiedPerformance } from 'types';
import { standardFetcher } from 'utils';

const usePerformanceRate = (nodeOperatorId?: NodeOperatorId) => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin;
  const url = `${BASE_URL}/${API_ROUTES.PERFORMANCE}?node-operator-id=${nodeOperatorId}`;

  return useQuery({
    queryKey: ['performance', { nodeOperatorId }],
    queryFn: async () => standardFetcher<UnifiedPerformance>(url),
    enabled: nodeOperatorId !== undefined,
    ...STRATEGY_LAZY,
  });
};

export const usePerformanceApi = () => {
  const nodeOperatorId = useNodeOperatorId();
  const queryRateApi = usePerformanceRate(nodeOperatorId);
  // const queryPerfLeeway = usePerfLeeway(); // FIXME: use perf leeway

  const data = queryRateApi.data;
  const leeway = 500; // queryPerfLeeway.data;

  return useQuery({
    queryKey: ['performance-api', nodeOperatorId, data, leeway],
    queryFn: (): Performance | undefined => {
      if (!data || !leeway) return undefined;
      const offset = leeway / Number(PERCENT_BASIS);
      const threshold = data.overallAttestationRate - offset;
      const status: RateStatus =
        data.operatorAttestationRate <= threshold
          ? 'bad'
          : data.operatorAttestationRate >
              data.overallAttestationRate - offset / 2
            ? 'good'
            : 'semi';

      return {
        ...data,
        threshold,
        status,
      };
    },
    enabled: !!data && !!leeway,
    ...STRATEGY_LAZY,
  });
};
