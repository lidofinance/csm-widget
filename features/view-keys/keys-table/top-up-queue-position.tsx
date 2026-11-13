import { Caption, InfoTooltip, Stack } from '@lidofinance/lido-app-ui';
import { ICON_TOOLTIP_TEST_ID } from 'shared/components/icon-tooltip/test-ids';
import { FC } from 'react';

const TOP_UP_QUEUE_TOOLTIP =
  'Deposited keys wait in this queue to receive additional stake. The position updates as the queue is processed.';

type Props = {
  position?: number;
  total?: number;
};

export const TopUpQueuePosition: FC<Props> = ({ position, total }) => {
  if (position === undefined || total === undefined) return null;

  return (
    <Stack
      direction="row"
      gap={8}
      align="center"
      data-testid="topUpQueuePosition"
    >
      <Caption color="secondary">
        Top up in queue #{position + 1}/{total}
      </Caption>
      <InfoTooltip
        dataTestId={ICON_TOOLTIP_TEST_ID}
        content={TOP_UP_QUEUE_TOOLTIP}
      />
    </Stack>
  );
};
