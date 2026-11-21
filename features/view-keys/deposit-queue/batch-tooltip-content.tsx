import { Divider, Stack } from '@lidofinance/lido-app-ui';
import { FC, Fragment } from 'react';
import { getPriorityName } from './get-priority-name';
import { QueueAmount } from './queue-amount';
import s from './styles.module.css';
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
    <Stack direction="row" gap={16}>
      {metadata.map((batch, index) => (
        <Fragment key={index}>
          {index > 0 && <Divider orientation="vertical" />}
          <div className={s.tooltipContent}>
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
          </div>
        </Fragment>
      ))}
    </Stack>
  );
};
