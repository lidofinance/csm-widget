import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { parseEther } from 'viem';
import { VettedGateAbi } from '@lidofinance/lido-csm-sdk/abi';
import type { Hex } from '../constants.ts';
import type { ForkActionsService } from '../forkActions.service.ts';

/**
 * Claims the gate's curve onto `noId` with `member`'s proof, consuming it.
 * `treeAddresses` must match the last `setGateAddrs` call for this gate.
 */
export const claimGateCurve = async function (
  this: ForkActionsService,
  selector: 'ics' | 'idvtc',
  noId: number,
  member: Hex,
  treeAddresses: Hex[] = [member],
): Promise<void> {
  await this.step(
    `[Contract] Claim "${selector}" curve for NO #${noId} with proof of ${member}`,
    async () => {
      const gate = this.addresses.gates?.[selector];
      if (!gate) {
        throw new Error(
          `No "${selector}" gate address for module "${this.module}" on ${this.chain}`,
        );
      }

      const tree = StandardMerkleTree.of(
        treeAddresses.map((address) => [address]),
        ['address'],
      );
      const proof = tree.getProof([member]) as Hex[];

      await this.fund(member, parseEther('1'));
      await this.sendAs(member, () =>
        this.client.writeContract({
          address: gate,
          abi: VettedGateAbi,
          functionName: 'claimBondCurve',
          args: [BigInt(noId), proof],
          account: member,
          chain: null,
        }),
      );
    },
  );
};
