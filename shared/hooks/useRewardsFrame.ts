import { useContractSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT, STRATEGY_IMMUTABLE } from 'consts/swr-strategies';
import { useMemo } from 'react';
import { useHashConsesusRPC } from './useCsmContracts';
import { useMergeSwr } from './useMergeSwr';

export const useChainConfig = (config = STRATEGY_IMMUTABLE) => {
  return useContractSWR({
    contract: useHashConsesusRPC(),
    method: 'getChainConfig',
    params: [],
    config,
  });
};

export const useFrameConfig = (config = STRATEGY_IMMUTABLE) => {
  return useContractSWR({
    contract: useHashConsesusRPC(),
    method: 'getFrameConfig',
    params: [],
    config,
  });
};

export const useCurrentFrame = (config = STRATEGY_CONSTANT) => {
  return useContractSWR({
    contract: useHashConsesusRPC(),
    method: 'getCurrentFrame',
    params: [],
    config,
  });
};

export const useRewardsFrame = () => {
  const chainConfig = useChainConfig();
  const frameConfig = useFrameConfig();
  const currentFrame = useCurrentFrame();

  return useMergeSwr(
    [chainConfig, frameConfig, currentFrame],
    useMemo(() => {
      if (!chainConfig.data || !frameConfig.data || !currentFrame.data)
        return undefined;

      const timestamp = currentFrame.data.refSlot
        .mul(chainConfig.data.secondsPerSlot)
        .add(chainConfig.data.genesisTime)
        .toNumber();

      const duration = frameConfig.data.epochsPerFrame
        .mul(chainConfig.data.slotsPerEpoch)
        .mul(chainConfig.data.secondsPerSlot)
        .toNumber();

      return {
        lastRewards: timestamp,
        nextRewards: timestamp + duration,
        prevRewards: timestamp - duration,
      };
    }, [chainConfig.data, frameConfig.data, currentFrame.data]),
  );
};
