import { parseEther } from 'viem';
import { CuratedModuleAbi } from '@lidofinance/lido-csm-sdk/abi';
import type { ForkActionsService } from '../forkActions.service.ts';

export const enableTopUpAllocation = async function (
  this: ForkActionsService,
  noId: number,
): Promise<void> {
  await this.step(
    `[Contract] Enable top-up allocation for NO #${noId}`,
    async () => {
      const admin = await this.roleMember('DEFAULT_ADMIN_ROLE');
      await this.grantRole('ENABLE_TOP_UP_ALLOCATION_ROLE', admin);
      await this.fund(admin, parseEther('1'));
      await this.sendAs(admin, () =>
        this.client.writeContract({
          address: this.addresses.module,
          abi: CuratedModuleAbi,
          functionName: 'enableTopUpAllocation',
          args: [BigInt(noId)],
          account: admin,
          chain: null,
        }),
      );
    },
  );
};
