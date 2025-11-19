import { Divider } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { getPriorityName } from './get-priority-name';
import { TooltipContentStyle } from './style';
import { BatchMetadata, GraphPart } from './types';

type AddedTooltipContentProps = {
  metadata: BatchMetadata;
};

export const AddedTooltipContent: FC<AddedTooltipContentProps> = ({
  metadata,
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
            <span>Submitting keys: {item.keysCount.toString()}</span>
            <span>Keys ahead: {item.position.toString()}</span>
          </TooltipContentStyle>
        </>
      ))}
    </Stack>
  );
};
