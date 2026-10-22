import { Text } from '@lidofinance/lido-ui';
import { useNodeOperatorId, useTopUpAllocationEnabled } from 'modules/web3';
import { FC } from 'react';
import { HatBlock, Stack } from 'shared/components';

export const TopUpDisabledBanner: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: enabled } = useTopUpAllocationEnabled({ nodeOperatorId });

  if (enabled !== false) return null;

  return (
    <HatBlock accent="secondary">
      <Stack direction="column">
        <Text size="sm" weight={700}>
          Top-up deposits to this Node Operator are currently disabled
        </Text>
        <Text size="xxs">
          Your operator is still eligible to receive seed deposits. Top-up
          deposits can be enabled by the CMC.
        </Text>
      </Stack>
    </HatBlock>
  );
};
