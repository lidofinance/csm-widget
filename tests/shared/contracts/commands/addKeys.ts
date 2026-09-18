import { randomBytes } from 'node:crypto';
import { parseEther, toHex } from 'viem';
import { AccountingAbi, BaseModuleAbi } from '@lidofinance/lido-csm-sdk/abi';
import type { ForkActionsService } from '../forkActions.service.ts';

export const addKeys = async function (
  this: ForkActionsService,
  noId: number,
  keysCount: number,
): Promise<void> {
  await this.step(
    `[Contract] Add ${keysCount} key(s) for NO #${noId}`,
    async () => {
      const value = await this.step(
        `Read required bond for ${keysCount} more key(s)`,
        () =>
          this.client.readContract({
            address: this.addresses.accounting,
            abi: AccountingAbi,
            functionName: 'getRequiredBondForNextKeys',
            args: [BigInt(noId), BigInt(keysCount)],
          }),
      );
      const manager = await this.manager(noId);
      await this.fund(manager, value + parseEther('1'));
      await this.sendAs(manager, () =>
        this.client.writeContract({
          address: this.addresses.module,
          abi: BaseModuleAbi,
          functionName: 'addValidatorKeysETH',
          args: [
            manager,
            BigInt(noId),
            BigInt(keysCount),
            toHex(randomBytes(48 * keysCount)),
            toHex(randomBytes(96 * keysCount)),
          ],
          account: manager,
          chain: null,
          value,
        }),
      );
    },
  );
};
