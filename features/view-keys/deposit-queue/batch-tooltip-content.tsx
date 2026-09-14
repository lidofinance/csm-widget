import { Divider } from '@lidofinance/lido-ui';
import { FC, Fragment } from 'react';
import { Stack } from 'shared/components';
import { getPriorityName } from './get-priority-name';
import { QueueAmount } from './queue-amount';
import { TooltipContentStyle } from './style';
import { BatchMetadata, GraphPart, QueueUnit } from './types';

type BatchTooltipContentProps = {
  metadata: BatchMetadata;
  unit: QueueUnit;
};

export const BatchTooltipContent: FC<BatchTooltipContentProps> = ({
  metadata,
  unit,
}) => {
  return (
    <Stack direction="row" gap="md">
      {metadata.map((batch, index) => (
        <Fragment key={index}>
          {index > 0 && <Divider type="vertical" />}
          <TooltipContentStyle>
            <strong>
              {batch.combined
                ? 'Multiple batches'
                : getPriorityName(`priority${batch.priority}` as GraphPart)}
            </strong>
            <span>
              {unit === 'eth' ? 'Stake:' : 'Keys:'}{' '}
              <QueueAmount amount={batch.amount} unit={unit} />
            </span>
            <span>
              {unit === 'eth' ? 'Stake ahead:' : 'Keys ahead:'}{' '}
              <QueueAmount amount={batch.position} unit={unit} />
            </span>
          </TooltipContentStyle>
        </Fragment>
      ))}
    </Stack>
  );
};
