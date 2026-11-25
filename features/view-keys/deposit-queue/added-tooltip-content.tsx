import { Divider, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { getPriorityName } from './get-priority-name';
import { QueueAmount } from './queue-amount';
import s from './styles.module.css';
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
    <Stack direction="column" gap={8}>
      {metadata.map((item, index) => (
        <>
          {index > 0 && <Divider />}
          <div className={s.tooltipContent}>
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
          </div>
        </>
      ))}
    </Stack>
  );
};
