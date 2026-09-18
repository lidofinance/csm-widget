import { maxUint256, parseEther } from 'viem';
import { BaseModuleAbi } from '@lidofinance/lido-csm-sdk/abi';
import { stakingRouter } from '../constants.ts';
import type { ForkActionsService } from '../forkActions.service.ts';

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
