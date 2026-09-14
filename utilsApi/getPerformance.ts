import ms from 'ms';

import { config, secretConfig } from 'config';
import { API_ROUTES } from 'consts/api';
import { UnifiedPerformance } from 'types';
import { standardFetcher } from 'utils';
import { responseTimeExternalMetricWrapper } from './external-metrics';
import { getCurrentFrame } from './getCurrentFrame';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

const MIN_NUMBER_EPOCHS = 62; // ~ 6 hours
const MAX_NUMBER_EPOCHS = 6750; // one month

export const getPerformance = async (
  nodeOperatorId: string,
): Promise<UnifiedPerformance> => {
  const chainId = config.defaultChain;
  if (chainId !== CHAINS.Mainnet) {
    throw new Error(`Error: MigaLabs is not support chain ${chainId}`);
  }
  const currentFrame = await getCurrentFrame();

  const response = await fetchPerformance(
    nodeOperatorId,
    currentFrame.numberEpochs,
  );

  return {
    ...currentFrame,
    operatorAttestationRate: response.data.operator_unified_performance,
    overallAttestationRate: response.data.network_unified_performance,
  };
};

type MigaLabsApiResponse = {
  data: {
    operator_unified_performance: number;
    network_unified_performance: number;
  };
};

const fetchPerformance = async (
  nodeOperatorId: string,
  countEpochs: number,
) => {
  const { migalabsApiUrl: apiUrl, migalabsApiToken: apiToken } = secretConfig;
  if (!apiUrl || !apiToken) {
    throw new Error('Error: MigaLabs API URL or token is not configured');
  }

  const numberEpochs = Math.min(
    MAX_NUMBER_EPOCHS,
    Math.max(countEpochs, MIN_NUMBER_EPOCHS),
  );

  const url = `${apiUrl}?operator_number=${nodeOperatorId}&number_epochs=${numberEpochs}&network=mainnet`;

  return responseTimeExternalMetricWrapper({
    target: apiUrl,
    route: API_ROUTES.PERFORMANCE,
    entity: 'migalabs',
    request: () =>
      standardFetcher<MigaLabsApiResponse>(url, {
        signal: AbortSignal.timeout(ms('5s')),
        headers: { 'X-Api-Key': apiToken },
      }),
  });
};
