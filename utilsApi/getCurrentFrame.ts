import { config } from 'config';
import { Cache } from 'memory-cache';
import { CurrentFrame } from 'types/ethseer';
import { getClient, getCsmContract } from './getClient';

const cache = new Cache<string, CurrentFrame>();

export const getCurrentFrame = async () => {
  const cacheKey = `${config.CACHE_ETHSEER_RATE_KEY}_frame`;
  const data = cache.get(cacheKey);
  if (data) {
    return data;
  }

  const currentFrame = await _getCurentFrame();

  cache.put(cacheKey, currentFrame, config.CACHE_ETHSEER_RATE_TTL);
  return currentFrame;
};

export const _getCurentFrame = async (): Promise<CurrentFrame> => {
  const client = getClient();

  const hashConsensus = getCsmContract(client, 'HashConsensus');
  const csFeeOracle = getCsmContract(client, 'CSFeeOracle');

  const [
    [slotsPerEpoch, secondsPerSlot, genesisTime],
    [, epochsPerFrame],
    refSlot,
    { timestamp: latestBlockTimestamp },
  ] = await Promise.all([
    hashConsensus.read.getChainConfig(),
    hashConsensus.read.getFrameConfig(),
    csFeeOracle.read.getLastProcessingRefSlot(),
    client.getBlock({ blockTag: 'latest' }),
  ]);

  const latestSlot = (latestBlockTimestamp - genesisTime) / secondsPerSlot;
  const slotsPerFrame = epochsPerFrame * slotsPerEpoch;

  const startSlot =
    ((latestSlot - refSlot) / slotsPerFrame) * slotsPerFrame + refSlot;
  const startTimestamp = startSlot * secondsPerSlot + genesisTime;
  const numberEpochs = (latestSlot - startSlot) / slotsPerEpoch;

  return {
    endTimestamp: Number(latestBlockTimestamp),
    startTimestamp: Number(startTimestamp),
    numberEpochs: Number(numberEpochs),
  };
};
