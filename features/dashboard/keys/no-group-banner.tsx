import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { HatBlock, Stack } from 'shared/components';

type Props = {
  hasGroup: boolean;
};

export const NoGroupBanner: FC<Props> = ({ hasGroup }) => (
  <HatBlock accent="secondary">
    <Stack direction="column">
      <Text size="sm" weight={700}>
        Deposits to this Node Operator are currently paused
      </Text>
      <Text size="xxs">
        {!hasGroup
          ? 'Your sub-operator is unable to receive deposits because it has not yet been added to the Node Operator group. Deposits will be enabled once the CMC adds it to the group.'
          : 'Your sub-operator is unable to receive deposits because its weight in the Node Operator group is zero. Deposits will be enabled once the CMC updates its weight.'}
      </Text>
    </Stack>
  </HatBlock>
);
