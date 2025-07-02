import { test } from '@playwright/test';
import { contractClients } from 'tests/services/clients.contract';

export const getReportFrameForLastRewards = async () => {
  return test.step('Get timestamps by rewards info from contract', async () => {
    const currentFrame =
      await contractClients.CSFeeOracle.getLastProcessingRefSlot();

    const chainConfig = await contractClients.HashConsensus.getChainConfig();
    const frameConfig = await contractClients.HashConsensus.getFrameConfig();

    if (!chainConfig || !frameConfig || !currentFrame) return undefined;

    const timestamp = currentFrame
      .mul(chainConfig.secondsPerSlot)
      .add(chainConfig.genesisTime)
      .toNumber();

    const duration = frameConfig.epochsPerFrame
      .mul(chainConfig.slotsPerEpoch)
      .mul(chainConfig.secondsPerSlot)
      .toNumber();

    return {
      lastRewards: timestamp,
      nextRewards: timestamp + duration,
      prevRewards: timestamp - duration,
    };
  });
};
