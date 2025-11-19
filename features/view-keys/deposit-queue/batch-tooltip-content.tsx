import { Divider } from '@lidofinance/lido-ui';
import { FC } from 'react';
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
    <Stack direction="column" gap="sm">
      {metadata.map((batch, index) => (
        <>
          {index > 0 && <Divider />}
          <TooltipContentStyle>
            <strong>
              {getPriorityName(`priority${batch.priority}` as GraphPart)}
            </strong>
            <span>Keys: {batch.keysCount.toString()}</span>
            <span>Keys ahead: {batch.position.toString()}</span>
          </TooltipContentStyle>
        </>
      ))}
    </Stack>
  );
};
