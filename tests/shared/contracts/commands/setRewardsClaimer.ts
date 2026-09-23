import { parseEther } from 'viem';
import { AccountingAbi, BaseModuleAbi } from '@lidofinance/lido-csm-sdk/abi';
import type { Hex } from '../constants.ts';
import type { ForkActionsService } from '../forkActions.service.ts';

export const setRewardsClaimer = async function (
  this: ForkActionsService,
  noId: number,
  claimerAddress: Hex,
): Promise<void> {
  await this.step(
    `[Contract] Set Rewards claimer of NO #${noId} to ${claimerAddress}`,
    async () => {
      const { rewardAddress } = await this.step(
        `Resolve rewards address of NO #${noId}`,
        () =>
          this.client.readContract({
            address: this.addresses.module,
            abi: BaseModuleAbi,
            functionName: 'getNodeOperatorManagementProperties',
            args: [BigInt(noId)],
          }),
      );

      await this.fund(rewardAddress, parseEther('1'));
      await this.sendAs(rewardAddress, () =>
        this.client.writeContract({
          address: this.addresses.accounting,
          abi: AccountingAbi,
          functionName: 'setCustomRewardsClaimer',
          args: [BigInt(noId), claimerAddress],
          account: rewardAddress,
          chain: null,
        }),
      );
    },
  );
};
