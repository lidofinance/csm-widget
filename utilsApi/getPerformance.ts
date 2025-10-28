import ms from 'ms';

import { config, secretConfig } from 'config';
import { UnifiedPerformance } from 'types';
import { standardFetcher } from 'utils';
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
  const apiUrl =
    'https://www.migalabs.io/api/eth/v1/beacon/consensus/lido/csm/unified_performance';
  const { migalabsApiToken: apiToken } = secretConfig;
  if (!apiUrl || !apiToken) {
    throw new Error('Error: MigaLabs API URL or token is not configured');
  }

  const numberEpochs = Math.min(
    MAX_NUMBER_EPOCHS,
    Math.max(countEpochs, MIN_NUMBER_EPOCHS),
  );

  const controller = new AbortController();
  const TIMEOUT = ms('5s');
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  const url = `${apiUrl}?operator_number=${nodeOperatorId}&number_epochs=${numberEpochs}&network=mainnet`;
  const response = await standardFetcher<MigaLabsApiResponse>(url, {
    signal: controller.signal,
    headers: { 'X-Api-Key': apiToken },
  });

  clearTimeout(timeoutId);
  return response;
};
