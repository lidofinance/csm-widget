import { config } from 'config';
import { Cache } from 'memory-cache';
import { CurrentFrame } from 'types';
import { getClient } from './getClient';

const cache = new Cache<string, CurrentFrame>();

export const getCurrentFrame = async () => {
  const cacheKey = `${config.CACHE_MIGALABS_RATE_KEY}_frame`;
  const data = cache.get(cacheKey);
  if (data) {
    return data;
  }

  const currentFrame = await _getCurentFrame();

  cache.put(cacheKey, currentFrame, config.CACHE_MIGALABS_RATE_TTL);
  return currentFrame;
};

export const _getCurentFrame = async (): Promise<CurrentFrame> => {
  const csm = getClient();
  const frame = await csm.frame.getCurentFrame();

  return {
    endTimestamp: frame.now,
    startTimestamp: frame.start,
    numberEpochs: frame.passEpochs,
  };
};
