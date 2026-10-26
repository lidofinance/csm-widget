import { maxUint256, parseEther } from 'viem';
import { TOPUP_QUEUE_MODULES } from '@lidofinance/lido-csm-sdk';
import { BaseModuleAbi, CSModuleAbi } from '@lidofinance/lido-csm-sdk/abi';
import { stakingRouter } from '../constants.ts';
import type { ForkActionsService } from '../forkActions.service.ts';

// Enough per key for the module to take it out of the top-up queue.
const TOP_UP_PER_KEY = parseEther('31');

export const depositKeys = async function (
  this: ForkActionsService,
  depositsCount: number,
): Promise<void> {
  await this.step(`[Contract] Deposit ${depositsCount} key(s)`, async () => {
    const router = stakingRouter(this.chain);
    await this.fund(router, parseEther('1'));

    await this.step('Refresh deposit info', () =>
      this.sendAs(router, () =>
        this.client.writeContract({
          address: this.addresses.module,
          abi: BaseModuleAbi,
          functionName: 'batchDepositInfoUpdate',
          args: [maxUint256],
          account: router,
          chain: null,
        }),
      ),
    );

    // A 0x02 module parks each deposited key in the top-up queue, and a full
    // queue leaves nothing depositable. Topping the keys up drains it.
    if (TOPUP_QUEUE_MODULES.has(this.module)) {
      await this.step('Top up keys in the top-up queue', async () => {
        const length = (
          await this.client.readContract({
            address: this.addresses.module,
            abi: CSModuleAbi,
            functionName: 'getTopUpQueue',
          })
        )[2];
        if (length === 0n) return;

        const pubkeys = await this.client.readContract({
          address: this.addresses.module,
          abi: CSModuleAbi,
          functionName: 'getKeysForTopUp',
          args: [length],
        });
        const items = await Promise.all(
          pubkeys.map((_, index) =>
            this.client.readContract({
              address: this.addresses.module,
              abi: CSModuleAbi,
              functionName: 'getTopUpQueueItem',
              args: [BigInt(index)],
            }),
          ),
        );

        await this.sendAs(router, () =>
          this.client.writeContract({
            address: this.addresses.module,
            abi: CSModuleAbi,
            functionName: 'allocateDeposits',
            args: [
              TOP_UP_PER_KEY * BigInt(items.length),
              pubkeys,
              items.map(([, keyIndex]) => keyIndex),
              items.map(([noId]) => noId),
              items.map(() => TOP_UP_PER_KEY),
            ],
            account: router,
            chain: null,
          }),
        );
      });
    }

    const summary = await this.step('Read module summary', () =>
      this.client.readContract({
        address: this.addresses.module,
        abi: BaseModuleAbi,
        functionName: 'getStakingModuleSummary',
      }),
    );
    const depositable = summary[2];
    const count =
      depositable < BigInt(depositsCount) ? depositable : BigInt(depositsCount);

    await this.step(
      `Obtain deposit data for ${count} of ${depositable} depositable key(s)`,
      () =>
        this.sendAs(router, () =>
          this.client.writeContract({
            address: this.addresses.module,
            abi: BaseModuleAbi,
            functionName: 'obtainDepositData',
            args: [count, '0x'],
            account: router,
            chain: null,
          }),
        ),
    );
  });
};
