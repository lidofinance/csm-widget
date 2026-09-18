import { parseEther } from 'viem';
import { AccountingAbi, BaseModuleAbi } from '../abi';
import type { ForkActionsService } from '../forkActions.service';

export const settlePenalty = async function (
  this: ForkActionsService,
  noId: number,
): Promise<void> {
  await this.step(`[Contract] Settle penalty for NO #${noId}`, async () => {
    const settler = await this.roleMember(
      'SETTLE_GENERAL_DELAYED_PENALTY_ROLE',
    );
    const nonce = await this.client.readContract({
      address: this.addresses.accounting,
      abi: AccountingAbi,
      functionName: 'getBondLockNonce',
      args: [BigInt(noId)],
    });

    await this.fund(settler, parseEther('1'));
    await this.sendAs(settler, () =>
      this.client.writeContract({
        address: this.addresses.module,
        abi: BaseModuleAbi,
        functionName: 'settleGeneralDelayedPenalty',
        args: [[BigInt(noId)], [nonce]],
        account: settler,
        chain: null,
      }),
    );
  });
};
