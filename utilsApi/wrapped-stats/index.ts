import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { config } from 'config';
import { WrappedStatsResponse } from 'features/wrapped/data';
import stats from './stats.json';

export const getWrappedStats = async (
  id: string,
): Promise<WrappedStatsResponse> => {
  const chainId = config.defaultChain;
  if (chainId !== CHAINS.Mainnet) {
    throw new Error(`Error: Wrapped is not support chain ${chainId}`);
  }

  return stats[id as keyof typeof stats] || null;
};

export const getWrappedStatsByHash = async (
  hash: string,
): Promise<WrappedStatsResponse> => {
  const operatorEntry = Object.entries(stats).find(
    ([_, stat]) => stat.hash === hash,
  );

  return operatorEntry ? operatorEntry[1] : null;
};
