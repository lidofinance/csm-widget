import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { IconTooltip, Stack } from 'shared/components';

const TOP_UP_QUEUE_TOOLTIP =
  'Deposited keys wait in this queue to receive additional stake. The position updates as the queue is processed.';

type Props = {
  position?: number;
  total?: number;
};

export const TopUpQueuePosition: FC<Props> = ({ position, total }) => {
  if (position === undefined || total === undefined) return null;

  return (
    <Stack gap="sm" align="center" data-testid="topUpQueuePosition">
      <Text size="xxs" color="secondary">
        Top up in queue #{position + 1}/{total}
      </Text>
      <IconTooltip type="info" tooltip={TOP_UP_QUEUE_TOOLTIP} />
    </Stack>
  );
};
