import { test } from '@playwright/test';
import { widgetFullConfig } from '../config';
import {
  LidoSDKCsm,
  LidoSDKCsm02,
  MODULE_CONFIG,
  MODULE_NAME,
  SUPPORTED_CHAINS,
} from '@lidofinance/lido-csm-sdk';
import { LidoSDKCore } from '@lidofinance/lido-ethereum-sdk';
import { formatEther, isAddressEqual, type Address } from 'viem';

export class LidoSDKClient extends LidoSDKCsm {
  private readonly sdkCore: LidoSDKCore;
  private readonly ipfsGateways: string[];

  constructor(rpcUrls: string[]) {
    const core = new LidoSDKCore({
      chainId: widgetFullConfig.standConfig.networkConfig.chainId,
      rpcUrls,
    });
    const ipfsGateways = [
      `${widgetFullConfig.standConfig.ipfsConfig.gateway}{cid}`,
    ];
    super({ core, ipfsGateways });
    this.sdkCore = core;
    this.ipfsGateways = ipfsGateways;
  }

  async getMyOperatorsBond(address: Address): Promise<bigint> {
    return test.step(`Get bond of every operator of ${address}`, async () => {
      const chainId = widgetFullConfig.standConfig.networkConfig
        .chainId as SUPPORTED_CHAINS;
      const sdks: (LidoSDKCsm | LidoSDKCsm02)[] = [this];
      if (MODULE_CONFIG[MODULE_NAME.CSM_02][chainId]) {
        sdks.push(
          new LidoSDKCsm02({
            core: this.sdkCore,
            ipfsGateways: this.ipfsGateways,
          }),
        );
      }

      let total = 0n;
      for (const sdk of sdks) {
        const operators =
          await sdk.discovery.getNodeOperatorsByAddress(address);
        for (const operator of operators) {
          if (
            !isAddressEqual(operator.managerAddress, address) &&
            !isAddressEqual(operator.rewardsAddress, address)
          ) {
            continue;
          }
          const { current } = await sdk.operator.getBondBalance(
            operator.nodeOperatorId,
          );
          total += current;
        }
      }
      return total;
    });
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

  async getRewards(nodeOperatorId: number) {
    return test.step(`Get rewards for #${nodeOperatorId} node`, async () => {
      const data = await this.rewards.getRewards(BigInt(nodeOperatorId));
      return {
        ...data,
        available: formatEther(data.available),
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

  async isPendingRole(nodeOperatorNumber: number, role: 'manager' | 'rewards') {
    return test.step(`Check if ${role} address role is pending for #${nodeOperatorNumber} node`, async () => {
      const info = await this.operator.getInfo(BigInt(nodeOperatorNumber));

      return Boolean(
        role === 'manager'
          ? info.proposedManagerAddress
          : info.proposedRewardsAddress,
      );
    });
  }

  async getAllKeys(nodeOperatorNumber: bigint) {
    return test.step(`Get all keys for node operator #${nodeOperatorNumber}`, async () => {
      const operators = await this.operator.getKeys(nodeOperatorNumber);
      return operators;
    });
  }

  async evmSnapshot(): Promise<string> {
    return test.step('Take EVM snapshot', async () => {
      const snapshotId = await this.core.publicClient.request({
        method: 'evm_snapshot' as never,
        params: [] as never,
      });
      return snapshotId as string;
    });
  }

  async evmRevert(snapshotId: string): Promise<void> {
    await test.step(`Revert EVM to snapshot ${snapshotId}`, async () => {
      const reverted = await this.core.publicClient.request({
        method: 'evm_revert' as never,
        params: [snapshotId] as never,
      });

      // the node answers `false` when the snapshot is unknown or already
      // consumed — the chain keeps the dirty state and every later spec
      // silently inherits it, so fail loudly instead
      if (reverted === false) {
        throw new Error(
          `evm_revert returned false for snapshot ${snapshotId}: chain state was NOT restored`,
        );
      }
    });
  }
}
