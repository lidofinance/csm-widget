import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { config } from 'config';
import { WrappedStatsResponse } from 'features/wrapped/data';
import stats from './stats.json';

export const getWrappedStats = async (
  nodeOperatorId: string,
): Promise<WrappedStatsResponse> => {
  const chainId = config.defaultChain;
  if (chainId !== CHAINS.Mainnet) {
    throw new Error(`Error: Wrapped is not support chain ${chainId}`);
  }

  const operatorStats = stats[nodeOperatorId as keyof typeof stats];

  return operatorStats || null;
};
