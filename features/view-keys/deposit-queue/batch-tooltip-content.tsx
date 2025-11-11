import { DarkThemeProvider, Divider, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { getPriorityName } from './get-priority-name';
import { BatchMetadata, GraphPart } from './types';

type BatchTooltipContentProps = {
  metadata: BatchMetadata;
};

export const BatchTooltipContent: FC<BatchTooltipContentProps> = ({
  metadata,
}) => {
  return (
    <DarkThemeProvider>
      <Stack direction="column" gap="sm">
        {metadata.map((batch, index) => (
          <>
            {index > 0 && <Divider />}
            <Stack direction="column" gap="xs">
              <Text weight="bold" size="xxs">
                {getPriorityName(`priority${batch.priority}` as GraphPart)}
              </Text>
              <Text size="xxs">Keys: {batch.keysCount.toString()}</Text>
              <Text size="xxs">Keys ahead: {batch.position.toString()}</Text>
            </Stack>
          </>
        ))}
      </Stack>
    </DarkThemeProvider>
  );
};
