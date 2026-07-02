import { test } from '@playwright/test';
import {
  createPublicClient,
  http,
  parseEther,
  toHex,
  PublicClient,
} from 'viem';

/**
 * Low-level EVM/fork node helpers (anvil/hardhat RPC) shared across modules.
 * Not tied to any module SDK.
 */
export class EvmNodeService {
  private client: PublicClient;

  constructor(rpcUrl: string) {
    this.client = createPublicClient({ transport: http(rpcUrl) });
  }

  async snapshot(): Promise<string> {
    return test.step('Take EVM snapshot', async () => {
      const snapshotId = await this.client.request({
        method: 'evm_snapshot' as never,
        params: [] as never,
      });
      return snapshotId as string;
    });
  }

  async revert(snapshotId: string): Promise<void> {
    await test.step(`Revert EVM to snapshot ${snapshotId}`, async () => {
      await this.client.request({
        method: 'evm_revert' as never,
        params: [snapshotId] as never,
      });
    });
  }

  async setBalance(address: `0x${string}`, eth: number): Promise<void> {
    await test.step(`Fund ${address} with ${eth} ETH`, async () => {
      await this.client.request({
        method: 'anvil_setBalance' as never,
        params: [address, toHex(parseEther(String(eth)))] as never,
      });
    });
  }
}
