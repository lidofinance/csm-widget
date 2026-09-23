import { parseEther } from 'viem';
import { CuratedGateAbi, VettedGateAbi } from '@lidofinance/lido-csm-sdk/abi';
import type { GateSelector, Hex } from '../constants.ts';
import { pinTree } from '../tree.ts';
import type { ForkActionsService } from '../forkActions.service.ts';

const VETTED_SELECTORS: GateSelector[] = ['ics', 'idvtc'];

export const setGateAddrs = async function (
  this: ForkActionsService,
  selector: GateSelector | GateSelector[],
  ...addresses: Hex[]
): Promise<void> {
  const selectors = [selector].flat();

  await this.step(
    `[Contract] Set gate tree for [${selectors.join(', ')}] → ${addresses.join(', ')}`,
    async () => {
      const { root, cid } = await this.step('Build and pin merkle tree', () =>
        pinTree(addresses),
      );

      for (const name of selectors) {
        const address = this.addresses.gates?.[name];
        if (!address) {
          throw new Error(
            `No "${name}" gate address for module "${this.module}" on ${this.chain}`,
          );
        }
        const abi = VETTED_SELECTORS.includes(name)
          ? VettedGateAbi
          : CuratedGateAbi;

        await this.step(`Set tree on "${name}" gate ${address}`, async () => {
          const [adminRole, setTreeRole] = await Promise.all([
            this.client.readContract({
              address,
              abi,
              functionName: 'DEFAULT_ADMIN_ROLE',
            }),
            this.client.readContract({
              address,
              abi,
              functionName: 'SET_TREE_ROLE',
            }),
          ]);
          const admin = await this.client.readContract({
            address,
            abi,
            functionName: 'getRoleMember',
            args: [adminRole, 0n],
          });
          await this.fund(admin, parseEther('1'));

          await this.sendAs(admin, () =>
            this.client.writeContract({
              address,
              abi,
              functionName: 'grantRole',
              args: [setTreeRole, admin],
              account: admin,
              chain: null,
            }),
          );
          await this.sendAs(admin, () =>
            this.client.writeContract({
              address,
              abi,
              functionName: 'setTreeParams',
              args: [root, cid],
              account: admin,
              chain: null,
            }),
          );
        });
      }
    },
  );
};
