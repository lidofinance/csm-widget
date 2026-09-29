import { parseEther } from 'viem';
import { BaseModuleAbi } from '@lidofinance/lido-csm-sdk/abi';
import type { ForkActionsService } from '../forkActions.service.ts';

export const removeKeys = async function (
  this: ForkActionsService,
  noId: number,
  startIndex = 0,
  keysCount?: number,
): Promise<void> {
  await this.step(`[Contract] Remove keys of NO #${noId}`, async () => {
    const { totalAddedKeys, totalDepositedKeys } = await this.step(
      'Read key counts',
      () =>
        this.client.readContract({
          address: this.addresses.module,
          abi: BaseModuleAbi,
          functionName: 'getNodeOperator',
          args: [BigInt(noId)],
        }),
    );

    const removable = totalAddedKeys - totalDepositedKeys;
    const count = BigInt(keysCount ?? removable);
    if (count === 0n) {
      console.warn(`[Contract] NO #${noId} has no removable keys`);
      return;
    }
    if (count > removable) {
      throw new Error(
        `NO #${noId} has ${removable} removable key(s), cannot remove ${count}`,
      );
    }

    const manager = await this.manager(noId);
    await this.fund(manager, parseEther('1'));
    await this.sendAs(manager, () =>
      this.client.writeContract({
        address: this.addresses.module,
        abi: BaseModuleAbi,
        functionName: 'removeKeys',
        args: [BigInt(noId), BigInt(startIndex), count],
        account: manager,
        chain: null,
      }),
    );
  });
};
