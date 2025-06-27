import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';

export const YouWillReceive: FC<{
  waitingTime: string;
  receive: string;
}> = ({ waitingTime, receive }) => (
  <Stack direction="column" gap="xs">
    <Stack spaceBetween gap="xs" data-testid="waitingTime">
      <span>Waiting time:</span>
      <Text size="xxs">{waitingTime}</Text>
    </Stack>
    <Stack spaceBetween gap="xs" data-testid="receive">
      <span>Receive:</span>
      <Text size="xxs">{receive}</Text>
    </Stack>
  </Stack>
);
