import { test } from '@playwright/test';
import { CSFeeOracleContract } from 'tests/services/contractClients/CSFeeOracle.contract';
import { HashConsensusContract } from 'tests/services/contractClients/HashConsensus.contract';

export const getReportFrameForLastRewards = async () => {
  return test.step('Get timestamps by rewards info from contract', async () => {
    const currentFrame =
      await new CSFeeOracleContract().getLastProcessingRefSlot();
    const hashConsensusContract = new HashConsensusContract();
    const chainConfig = await hashConsensusContract.getChainConfig();
    const frameConfig = await hashConsensusContract.getFrameConfig();

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
