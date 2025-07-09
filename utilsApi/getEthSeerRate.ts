import ms from 'ms';

import { config, secretConfig } from 'config';
import { RateReponse } from 'types/ethseer';
import { standardFetcher } from 'utils';
import { getCurrentFrame } from './getCurrentFrame';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

const MIN_NUMBER_EPOCHS = 9; // one hour
const MAX_NUMBER_EPOCHS = 6750; // one month

export const getEthSeerRate = async (
  nodeOperatorId: string,
): Promise<RateReponse> => {
  const chainId = config.defaultChain;
  if (chainId !== CHAINS.Mainnet) {
    throw new Error(`Error: EthSeer is not support chain ${chainId}`);
  }
  const currentFrame = await getCurrentFrame();

  const response = await fetchAttestationRate(
    nodeOperatorId,
    currentFrame.numberEpochs,
  );

  return {
    ...currentFrame,
    operatorAttestationRate: response.operator_participation_rate,
    overallAttestationRate: response.overall_participation_rate,
  };
};

type EthseerApiResponse = {
  operator_participation_rate: number;
  overall_participation_rate: number;
};

const fetchAttestationRate = async (
  nodeOperatorId: string,
  countEpochs: number,
) => {
  const { ethseerApiUrl, ethseerApiToken } = secretConfig;
  if (!ethseerApiUrl || !ethseerApiToken) {
    throw new Error('Error: EthSeer API URL or token is not configured');
  }

  const numberEpochs = Math.min(
    MAX_NUMBER_EPOCHS,
    Math.max(countEpochs, MIN_NUMBER_EPOCHS),
  );

  const controller = new AbortController();
  const TIMEOUT = ms('5s');
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  const url = `${ethseerApiUrl}?operator_number=${nodeOperatorId}&number_epochs=${numberEpochs}`;
  const response = await standardFetcher<EthseerApiResponse>(url, {
    signal: controller.signal,
    headers: { 'X-Api-Key': ethseerApiToken },
  });

  clearTimeout(timeoutId);
  return response;
};
