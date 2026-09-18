import { parseEther } from 'viem';
import { BaseModuleAbi } from '../abi/index.ts';
import type { ForkActionsService } from '../forkActions.service.ts';

export const confirmManager = async function (
  this: ForkActionsService,
  noId: number,
): Promise<void> {
  await this.step(`[Contract] Confirm manager for NO #${noId}`, async () => {
    const { proposedManagerAddress } = await this.step(
      `Resolve proposed manager of NO #${noId}`,
      () =>
        this.client.readContract({
          address: this.addresses.module,
          abi: BaseModuleAbi,
          functionName: 'getNodeOperator',
          args: [BigInt(noId)],
        }),
    );

    await this.fund(proposedManagerAddress, parseEther('1'));
    await this.sendAs(proposedManagerAddress, () =>
      this.client.writeContract({
        address: this.addresses.module,
        abi: BaseModuleAbi,
        functionName: 'confirmNodeOperatorManagerAddressChange',
        args: [BigInt(noId)],
        account: proposedManagerAddress,
        chain: null,
      }),
    );
  });
};
