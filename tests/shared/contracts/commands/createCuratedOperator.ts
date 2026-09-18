import { randomBytes } from 'node:crypto';
import { parseEther, toHex, zeroAddress } from 'viem';
import { CuratedGateAbi } from '@lidofinance/lido-csm-sdk/abi';
import type { GateSelector, Hex } from '../constants.ts';
import type { ForkActionsService } from '../forkActions.service.ts';
import { pinTree } from '../tree.ts';

export const createCuratedOperator = async function (
  this: ForkActionsService,
  selector: GateSelector,
  address: Hex,
): Promise<number | undefined> {
  return this.step(
    `[Contract] Create curated operator via "${selector}" gate for ${address}`,
    async () => {
      const gate = this.addresses.gates?.[selector];
      if (!gate) {
        throw new Error(
          `No "${selector}" gate address for module "${this.module}" on ${this.chain}`,
        );
      }

      const read = <
        T extends
          | 'treeRoot'
          | 'treeCid'
          | 'DEFAULT_ADMIN_ROLE'
          | 'SET_TREE_ROLE'
          | 'RESUME_ROLE'
          | 'isPaused',
      >(
        functionName: T,
      ) =>
        this.client.readContract({
          address: gate,
          abi: CuratedGateAbi,
          functionName,
        });

      const [originalRoot, originalCid, adminRole, setTreeRole, resumeRole] =
        await Promise.all([
          read('treeRoot'),
          read('treeCid'),
          read('DEFAULT_ADMIN_ROLE'),
          read('SET_TREE_ROLE'),
          read('RESUME_ROLE'),
        ]);

      const admin = await this.client.readContract({
        address: gate,
        abi: CuratedGateAbi,
        functionName: 'getRoleMember',
        args: [adminRole, 0n],
      });
      await this.fund(admin, parseEther('1'));
      await this.fund(address, parseEther('1'));

      const write = (
        from: Hex,
        functionName: 'grantRole' | 'resume' | 'setTreeParams',
        args?: readonly unknown[],
      ) =>
        this.sendAs(from, () =>
          this.client.writeContract({
            address: gate,
            abi: CuratedGateAbi,
            functionName,
            args: args as never,
            account: from,
            chain: null,
          }),
        );

      const extra = toHex(randomBytes(20));
      const { tree, root, cid } = await this.step(
        'Build and pin temporary tree',
        () => pinTree([address, extra]),
      );
      const proof = tree.getProof(0) as Hex[];

      await this.step('Set temporary tree', async () => {
        await write(admin, 'grantRole', [setTreeRole, admin]);
        await write(admin, 'grantRole', [resumeRole, admin]);
        if (await read('isPaused')) await write(admin, 'resume');
        await write(admin, 'setTreeParams', [root, cid]);
      });

      try {
        return await this.step('Create node operator', async () => {
          const { result, request } = await this.client.simulateContract({
            address: gate,
            abi: CuratedGateAbi,
            functionName: 'createNodeOperator',
            args: [
              'fork-operator',
              'fork-test',
              zeroAddress,
              zeroAddress,
              proof,
            ],
            account: address,
          });
          await this.sendAs(address, () =>
            this.client.writeContract({ ...request, chain: null }),
          );
          return Number(result);
        });
      } catch (error) {
        if (!(error as Error).message.includes('AlreadyConsumed')) throw error;
        console.warn(
          `[Contract] ${address} already consumed gate "${selector}", skipping`,
        );
        return undefined;
      } finally {
        await this.step('Restore original tree', () =>
          write(admin, 'setTreeParams', [originalRoot, originalCid]),
        );
      }
    },
  );
};
