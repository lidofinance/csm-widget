import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { Accordion, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { Description } from './description';
import { DepositQueueGraph } from './deposit-queue-graph';

export const DepositQueue: FC<{ module?: MODULE_NAME }> = ({ module }) => (
  <Accordion
    summary={
      <Text as="h4" size="xxs" weight={700}>
        View deposit queue
      </Text>
    }
  >
    <Stack direction="column" gap="xxl">
      <DepositQueueGraph module={module} />
      <Description module={module} />
    </Stack>
  </Accordion>
);
