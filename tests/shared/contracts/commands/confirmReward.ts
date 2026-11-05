import { parseEther } from 'viem';
import { BaseModuleAbi } from '@lidofinance/lido-csm-sdk/abi';
import type { ForkActionsService } from '../forkActions.service.ts';

export const confirmReward = async function (
  this: ForkActionsService,
  noId: number,
): Promise<void> {
  await this.step(
    `[Contract] Confirm reward address for NO #${noId}`,
    async () => {
      const proposed = await this.getProposedRewardAddress(noId);
      await this.fund(proposed, parseEther('1'));
      await this.sendAs(proposed, () =>
        this.client.writeContract({
          address: this.addresses.module,
          abi: BaseModuleAbi,
          functionName: 'confirmNodeOperatorRewardAddressChange',
          args: [BigInt(noId)],
          account: proposed,
          chain: null,
        }),
      );
    },
  );
};
