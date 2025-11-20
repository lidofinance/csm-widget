import { test } from '@playwright/test';
import { widgetFullConfig } from 'tests/config';
import { LidoSDKCsm } from '@lidofinance/lido-csm-sdk';
import { LidoSDKCore } from '@lidofinance/lido-ethereum-sdk';
import { formatEther } from 'viem';

export class LidoSDKClient extends LidoSDKCsm {
  constructor(rpcUrls: string[]) {
    const core = new LidoSDKCore({
      chainId: widgetFullConfig.standConfig.networkConfig.chainId,
      rpcUrls,
    });
    super({ core });
  }

  async getBondSummary(nodeOperatorNumber: number) {
    return test.step(`Get bond summary for #${nodeOperatorNumber} node`, async () => {
      const bondSummary = await this.operator.getBondBalance(
        BigInt(nodeOperatorNumber),
      );

      return {
        required: formatEther(bondSummary.required),
        current: formatEther(bondSummary.current),
        excess: formatEther(bondSummary.delta),
      };
    });
  }

  async getLastRewards() {
    return test.step(`Get common last rewards date`, async () => {
      const rewardsFrame = await this.frame.getInfo();

      return {
        lastRewards: rewardsFrame.lastReport,
        prevRewards: rewardsFrame.lastReport - rewardsFrame.frameDuration,
        nextRewards: rewardsFrame.lastReport + rewardsFrame.frameDuration,
      };
    });
  }

  async getNodeOperatorsByAddress(address: `0x${string}`) {
    return test.step(`Get node operators by address: ${address}`, async () => {
      const operators = await this.satellite.getNodeOperatorsByAddress(address);
      return operators;
    });
  }

  async getNodeOperatorsByProposedAddress(address: `0x${string}`) {
    return test.step(`Get node operators by proposed address: ${address}`, async () => {
      const operators =
        await this.satellite.getNodeOperatorsByProposedAddress(address);
      return operators;
    });
  }
}
