import { Divider } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { getPriorityName } from './get-priority-name';
import { QueueAmount } from './queue-amount';
import { TooltipContentStyle } from './style';
import { BatchMetadata, GraphPart, QueueUnit } from './types';

type AddedTooltipContentProps = {
  metadata: BatchMetadata;
  unit: QueueUnit;
};

export const AddedTooltipContent: FC<AddedTooltipContentProps> = ({
  metadata,
  unit,
}) => {
  return (
    <Stack direction="column" gap="sm">
      {metadata.map((item, index) => (
        <>
          {index > 0 && <Divider />}
          <TooltipContentStyle>
            <strong>
              {getPriorityName(`priority${item.priority}` as GraphPart)}
            </strong>
            <span>
              {unit === 'eth' ? 'Submitting stake:' : 'Submitting keys:'}{' '}
              <QueueAmount amount={item.amount} unit={unit} />
            </span>
            <span>
              {unit === 'eth' ? 'Stake ahead:' : 'Keys ahead:'}{' '}
              <QueueAmount amount={item.position} unit={unit} />
            </span>
          </TooltipContentStyle>
        </>
      ))}
    </Stack>
  );
};
