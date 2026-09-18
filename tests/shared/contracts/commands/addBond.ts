import { parseEther } from 'viem';
import { AccountingAbi } from '../abi';
import type { ForkActionsService } from '../forkActions.service';

export const addBond = async function (
  this: ForkActionsService,
  noId: number,
  amountEth: string,
): Promise<void> {
  await this.step(
    `[Contract] Add bond ${amountEth} ETH for NO #${noId}`,
    async () => {
      const value = parseEther(amountEth);
      const manager = await this.manager(noId);

      await this.fund(manager, value + parseEther('1'));
      await this.sendAs(manager, () =>
        this.client.writeContract({
          address: this.addresses.accounting,
          abi: AccountingAbi,
          functionName: 'depositETH',
          args: [BigInt(noId)],
          account: manager,
          chain: null,
          value,
        }),
      );
    },
  );
};
