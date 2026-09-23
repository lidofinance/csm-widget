import { randomBytes } from 'node:crypto';
import { parseEther, toHex, zeroAddress } from 'viem';
import {
  AccountingAbi,
  PermissionlessGateAbi,
} from '@lidofinance/lido-csm-sdk/abi';
import type { Hex } from '../constants.ts';
import type { ForkActionsService } from '../forkActions.service.ts';

export const createPermissionlessOperator = async function (
  this: ForkActionsService,
  address: Hex,
  keysCount = 1,
): Promise<number> {
  return this.step(
    `[Contract] Create operator with ${keysCount} key(s) for ${address}`,
    async () => {
      const gate = this.addresses.permissionlessGate;
      if (!gate) {
        throw new Error(
          `No permissionless gate address for module "${this.module}" on ${this.chain}`,
        );
      }

      const curveId = await this.step('Read permissionless curve id', () =>
        this.client.readContract({
          address: gate,
          abi: PermissionlessGateAbi,
          functionName: 'CURVE_ID',
        }),
      );

      const value = await this.step(
        `Read required bond for ${keysCount} key(s)`,
        () =>
          this.client.readContract({
            address: this.addresses.accounting,
            abi: AccountingAbi,
            functionName: 'getBondAmountByKeysCount',
            args: [BigInt(keysCount), curveId],
          }),
      );

      await this.fund(address, value + parseEther('1'));

      return this.step('Create node operator', async () => {
        const { result, request } = await this.client.simulateContract({
          address: gate,
          abi: PermissionlessGateAbi,
          functionName: 'addNodeOperatorETH',
          args: [
            BigInt(keysCount),
            toHex(randomBytes(48 * keysCount)),
            toHex(randomBytes(96 * keysCount)),
            {
              managerAddress: address,
              rewardAddress: address,
              extendedManagerPermissions: false,
            },
            zeroAddress,
          ],
          account: address,
          value,
        });
        await this.sendAs(address, () =>
          this.client.writeContract({ ...request, chain: null }),
        );
        return Number(result);
      });
    },
  );
};
