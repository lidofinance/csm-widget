import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, STRATEGY_LAZY } from 'consts';
import { useModule, useNodeOperatorId } from 'modules/web3';
import { useShowRule } from 'shared/hooks';
import { UnifiedPerformance } from 'types';
import { standardFetcher } from 'utils';
import { getApiUrl } from 'utils/get-api-url';
import { derivePerformance } from '../utils/derive-performance';
import { isUprEnabled } from '../utils/is-upr-enabled';

// FIXME: use perf leeway from the contract
const PERF_LEEWAY = 500;

export const usePerformanceApi = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { isCSM } = useModule();
  const isMainnet = useShowRule()('IS_MAINNET');

  const url = getApiUrl(API_ROUTES.PERFORMANCE, {
    'node-operator-id': String(nodeOperatorId),
  });

  return useQuery({
    queryKey: ['performance', { nodeOperatorId }],
    queryFn: async () => standardFetcher<UnifiedPerformance>(url),
    select: (rate) => derivePerformance(rate, PERF_LEEWAY),
    enabled: isUprEnabled({ nodeOperatorId, isCSM, isMainnet }),
    ...STRATEGY_LAZY,
  });
};
