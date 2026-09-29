import { keccak256, parseEther, toHex } from 'viem';
import { BaseModuleAbi } from '@lidofinance/lido-csm-sdk/abi';
import type { ForkActionsService } from '../forkActions.service.ts';

const PENALTY_TYPE = keccak256(toHex('fork-test-penalty'));

export const reportPenalty = async function (
  this: ForkActionsService,
  noId: number,
  amountEth: string,
): Promise<void> {
  await this.step(
    `[Contract] Report penalty ${amountEth} ETH for NO #${noId}`,
    async () => {
      const reporter = await this.roleMember(
        'REPORT_GENERAL_DELAYED_PENALTY_ROLE',
      );
      await this.fund(reporter, parseEther('1'));
      await this.sendAs(reporter, () =>
        this.client.writeContract({
          address: this.addresses.module,
          abi: BaseModuleAbi,
          functionName: 'reportGeneralDelayedPenalty',
          args: [
            BigInt(noId),
            PENALTY_TYPE,
            parseEther(amountEth),
            'Fork test penalty',
          ],
          account: reporter,
          chain: null,
        }),
      );
    },
  );
};
