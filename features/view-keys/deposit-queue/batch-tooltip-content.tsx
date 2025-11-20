import { Divider } from '@lidofinance/lido-ui';
import { FC, Fragment } from 'react';
import { Stack } from 'shared/components';
import { getPriorityName } from './get-priority-name';
import { TooltipContentStyle } from './style';
import { BatchMetadata, GraphPart } from './types';

type BatchTooltipContentProps = {
  metadata: BatchMetadata;
};

export const BatchTooltipContent: FC<BatchTooltipContentProps> = ({
  metadata,
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
            <span>Keys: {batch.keysCount.toString()}</span>
            <span>Keys ahead: {batch.position.toString()}</span>
          </TooltipContentStyle>
        </Fragment>
      ))}
    </Stack>
  );
};
