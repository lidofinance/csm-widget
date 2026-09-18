import { parseEther } from 'viem';
import { BaseModuleAbi } from '../abi';
import type { Hex } from '../constants';
import type { ForkActionsService } from '../forkActions.service';

export const proposeReward = async function (
  this: ForkActionsService,
  noId: number,
  address: Hex,
): Promise<void> {
  await this.step(
    `[Contract] Propose reward address for NO #${noId} to ${address}`,
    async () => {
      const manager = await this.manager(noId);
      await this.fund(manager, parseEther('1'));
      await this.sendAs(manager, () =>
        this.client.writeContract({
          address: this.addresses.module,
          abi: BaseModuleAbi,
          functionName: 'proposeNodeOperatorRewardAddressChange',
          args: [BigInt(noId), address],
          account: manager,
          chain: null,
        }),
      );
    },
  );
};
