import { Text } from '@lidofinance/lido-ui';
import { isModuleCM } from 'consts';
import { useNodeOperatorId, useOperatorGroupId } from 'modules/web3';
import { FC } from 'react';
import { HatBlock, Stack } from 'shared/components';

export const NoGroupBanner: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: groupId, isPending } = useOperatorGroupId(nodeOperatorId);
  const show = isModuleCM && !isPending && !groupId;

  return (
    show && (
      <HatBlock accent="secondary">
        <Stack direction="column">
          <Text size="sm" weight={700}>
            Deposits to this Node Operator are currently paused
          </Text>
          <Text size="xxs">
            Your sub-operator is unable to receive deposits because it has not
            yet been added to the Node Operator group. Deposits will be enabled
            once the CMC adds it to the group.
          </Text>
        </Stack>
      </HatBlock>
    )
  );
};
