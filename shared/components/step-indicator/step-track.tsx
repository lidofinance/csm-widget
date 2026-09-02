import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from '../stack';
import { StepIndicator } from './step-indicator';

type StepTrackProps = {
  current: number;
  length: number;
};

export const StepTrack: FC<StepTrackProps> = ({ current, length }) => (
  <Stack direction="row" gap="md" center justify="space-between">
    <Text size="xxs" color="secondary" data-testid="stepTrackText" weight={500}>
      Step {current} of {length}
    </Text>
    <StepIndicator length={length} current={current - 1} backSolid halfGap />
  </Stack>
);
