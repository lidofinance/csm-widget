import { test } from '@playwright/test';
import { widgetFullConfig } from '../config';
import { LidoSDKCm } from '@lidofinance/lido-csm-sdk';
import { LidoSDKCore } from '@lidofinance/lido-ethereum-sdk';
import { formatEther } from 'viem';
import { parseDevnetAddresses } from './devnet';

export class LidoSDKClient extends LidoSDKCm {
  constructor(rpcUrls: string[], devnetAddresses: Record<string, string>) {
    const core = new LidoSDKCore({
      chainId: widgetFullConfig.standConfig.networkConfig.chainId,
      rpcUrls,
    });

    const overridedAddresses = devnetAddresses
      ? parseDevnetAddresses(devnetAddresses)
      : undefined;
    super({ core, overridedAddresses });
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
      const operators = await this.discovery.getNodeOperatorsByAddress(address);
      return operators;
    });
  }

  async getNodeOperatorsByProposedAddress(address: `0x${string}`) {
    return test.step(`Get node operators by proposed address: ${address}`, async () => {
      const operators =
        await this.discovery.getNodeOperatorsByProposedAddress(address);
      return operators;
    });
  }

  async getNodeOperatorInfo(nodeOperatorId: number) {
    return test.step(`Get node operator info for #${nodeOperatorId}`, async () => {
      const info = await this.operator.getInfo(BigInt(nodeOperatorId));
      return {
        depositableKeys: info.totalAddedKeys - info.totalDepositedKeys,
        activeKeys: info.totalDepositedKeys - info.totalWithdrawnKeys,
      };
    });
  }

  async getOperatorMetadata(nodeOperatorId: number) {
    return test.step(`Get operator metadata for #${nodeOperatorId}`, async () => {
      const info = await this.metaRegistry.getOperatorInfo(
        BigInt(nodeOperatorId),
      );
      return {
        name: info?.name ?? '',
        description: info?.description ?? '',
      };
    });
  }

  async getAllKeys(nodeOperatorNumber: bigint) {
    return test.step(`Get all keys for node operator #${nodeOperatorNumber}`, async () => {
      const operators = await this.operator.getKeys(nodeOperatorNumber);
      return operators;
    });
  }
}
