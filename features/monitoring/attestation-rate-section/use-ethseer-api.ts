import { useLidoSWR } from '@lido-sdk/react';
import { API_ROUTES } from 'consts/api';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useMemo } from 'react';
import { useMergeSwr, usePerfLeeway } from 'shared/hooks';
import { NodeOperatorId } from 'types';
import { RateReponse } from 'types/ethseer';
import { standardFetcher } from 'utils';

const BP = 10_000;

export type RateStatus = 'good' | 'semi' | 'bad';

const useEthSeerRate = (
  nodeOperatorId?: NodeOperatorId,
  config = STRATEGY_LAZY,
) => {
  const BASE_URL = typeof window === 'undefined' ? '' : window.location.origin;
  const url = `${BASE_URL}/${API_ROUTES.ETHSEER_RATE}?node-operator-id=${nodeOperatorId}`;

  return useLidoSWR(
    ['ethseer', nodeOperatorId],
    nodeOperatorId ? async () => standardFetcher<RateReponse>(url) : null,
    config,
  );
};

export const useEthseerApi = () => {
  const nodeOperatorId = useNodeOperatorId();
  const swrRateApi = useEthSeerRate(nodeOperatorId);
  const swrPerfLeeway = usePerfLeeway();

  const data = swrRateApi.data;
  const leeway = swrPerfLeeway.data;

  return useMergeSwr(
    [swrRateApi, swrPerfLeeway],
    useMemo(() => {
      if (!data || !leeway) return undefined;
      const offset = leeway.toNumber() / BP;
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
    }, [data, leeway]),
  );
};
