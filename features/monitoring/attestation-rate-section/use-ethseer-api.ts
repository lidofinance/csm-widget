import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { API_ROUTES, STRATEGY_LAZY } from 'consts';
import { useNodeOperatorId } from 'modules/web3';
import { RateReponse } from 'types/ethseer';
import { standardFetcher } from 'utils';

const BP = 10_000;

export type RateStatus = 'good' | 'semi' | 'bad';

const useEthSeerRate = (nodeOperatorId?: NodeOperatorId) => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin;
  const url = `${BASE_URL}/${API_ROUTES.ETHSEER_RATE}?node-operator-id=${nodeOperatorId}`;

  return useQuery({
    queryKey: ['ethseer', { nodeOperatorId }],
    queryFn: async () => standardFetcher<RateReponse>(url),
    enabled: nodeOperatorId !== undefined,
    ...STRATEGY_LAZY,
  });
};

export const useEthseerApi = () => {
  const nodeOperatorId = useNodeOperatorId();
  const queryRateApi = useEthSeerRate(nodeOperatorId);
  // const queryPerfLeeway = usePerfLeeway(); // FIXME: use perf leeway

  const data = queryRateApi.data;
  const leeway = 500; // queryPerfLeeway.data;

  return useQuery({
    queryKey: ['ethseer-api', nodeOperatorId, data, leeway],
    queryFn: ():
      | (RateReponse & { threshold: number; status: RateStatus })
      | undefined => {
      if (!data || !leeway) return undefined;
      const offset = leeway / BP;
      const threshold = data.overallAttestationRate - offset;
      return {
        ...data,
        threshold,
        status:
          data.operatorAttestationRate <= threshold
            ? 'bad'
            : data.operatorAttestationRate >
                data.overallAttestationRate - offset / 2
              ? 'good'
              : ('semi' as RateStatus),
      };
    },
    enabled: !!data && !!leeway,
    ...STRATEGY_LAZY,
  });
};
