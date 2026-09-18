import { parseEther } from 'viem';
import { MetaRegistryAbi } from '@lidofinance/lido-csm-sdk/abi';
import type { Hex } from '../constants.ts';
import type { ForkActionsService } from '../forkActions.service.ts';

export type GroupOperator = {
  id: number;
  weight: number;
};

type OperatorGroup = {
  name: string;
  subNodeOperators: readonly { nodeOperatorId: bigint; share: number }[];
  externalOperators: readonly { data: Hex }[];
};

const EMPTY_GROUP: OperatorGroup = {
  name: '',
  subNodeOperators: [],
  externalOperators: [],
};

export const createOperatorGroup = async function (
  this: ForkActionsService,
  operators: GroupOperator[],
): Promise<void> {
  const label = operators
    .map(({ id, weight }) => `#${id}:${weight}%`)
    .join(', ');

  await this.step(`[Contract] Create operator group (${label})`, async () => {
    const address = this.addresses.metaRegistry;
    if (!address) {
      throw new Error(`No metaRegistry address for module "${this.module}"`);
    }

    const [role, noGroupId] = await Promise.all([
      this.client.readContract({
        address,
        abi: MetaRegistryAbi,
        functionName: 'MANAGE_OPERATOR_GROUPS_ROLE',
      }),
      this.client.readContract({
        address,
        abi: MetaRegistryAbi,
        functionName: 'NO_GROUP_ID',
      }),
    ]);

    const manager = await this.step('Resolve group manager', () =>
      this.client.readContract({
        address,
        abi: MetaRegistryAbi,
        functionName: 'getRoleMember',
        args: [role, 0n],
      }),
    );
    await this.fund(manager, parseEther('1'));

    const save = (groupId: bigint, group: OperatorGroup) =>
      this.sendAs(manager, () =>
        this.client.writeContract({
          address,
          abi: MetaRegistryAbi,
          functionName: 'createOrUpdateOperatorGroup',
          args: [groupId, group],
          account: manager,
          chain: null,
        }),
      );

    for (const { id } of operators) {
      const groupId = await this.client.readContract({
        address,
        abi: MetaRegistryAbi,
        functionName: 'getNodeOperatorGroupId',
        args: [BigInt(id)],
      });
      if (groupId !== noGroupId) {
        await this.step(`Detach NO #${id} from group ${groupId}`, () =>
          save(groupId, EMPTY_GROUP),
        );
      }
    }

    await this.step(`Save group ${label}`, () =>
      save(noGroupId, {
        ...EMPTY_GROUP,
        subNodeOperators: operators.map(({ id, weight }) => ({
          nodeOperatorId: BigInt(id),
          share: weight * 100,
        })),
      }),
    );
  });
};
