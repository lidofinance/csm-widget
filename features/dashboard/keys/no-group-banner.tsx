import { Text } from '@lidofinance/lido-ui';
import { isModuleCM } from 'consts';
import {
  useNodeOperatorId,
  useOperatorGroupId,
  useOperatorWeight,
} from 'modules/web3';
import { FC } from 'react';
import { HatBlock, Stack } from 'shared/components';

export const NoGroupBanner: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: groupId, isPending: isGroupPending } =
    useOperatorGroupId(nodeOperatorId);
  const { data: weight, isPending: isWeightPending } =
    useOperatorWeight(nodeOperatorId);

  if (!isModuleCM || isGroupPending || isWeightPending) return null;

  if (!!groupId && !!weight) return null;

  return (
    <HatBlock accent="secondary">
      <Stack direction="column">
        <Text size="sm" weight={700}>
          Deposits to this Node Operator are currently paused
        </Text>
        <Text size="xxs">
          {!groupId
            ? 'Your sub-operator is unable to receive deposits because it has not yet been added to the Node Operator group. Deposits will be enabled once the CMC adds it to the group.'
            : 'Your sub-operator is unable to receive deposits because its weight in the Node Operator group is zero. Deposits will be enabled once the CMC updates its weight.'}
        </Text>
      </Stack>
    </HatBlock>
  );
};
