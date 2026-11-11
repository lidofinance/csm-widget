import { InfoTooltip } from '@lidofinance/lido-app-ui';
import { ICON_TOOLTIP_TEST_ID } from 'shared/components/icon-tooltip/test-ids';
import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';

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
      <InfoTooltip
        dataTestId={ICON_TOOLTIP_TEST_ID}
        content={TOP_UP_QUEUE_TOOLTIP}
      />
    </Stack>
  );
};
