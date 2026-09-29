import { parseEther } from 'viem';
import { BaseModuleAbi } from '@lidofinance/lido-csm-sdk/abi';
import type { Hex } from '../constants.ts';
import type { ForkActionsService } from '../forkActions.service.ts';

export const proposeManager = async function (
  this: ForkActionsService,
  noId: number,
  address: Hex,
): Promise<void> {
  await this.step(
    `[Contract] Propose manager for NO #${noId} to ${address}`,
    async () => {
      const manager = await this.manager(noId);
      await this.fund(manager, parseEther('1'));
      await this.sendAs(manager, () =>
        this.client.writeContract({
          address: this.addresses.module,
          abi: BaseModuleAbi,
          functionName: 'proposeNodeOperatorManagerAddressChange',
          args: [BigInt(noId), address],
          account: manager,
          chain: null,
        }),
      );
    },
  );
};
