import { Text, Divider } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from '../stack';
import { StepIndicator } from './step-indicator';
import { PATH } from 'consts';
import { BackButton } from '../back-button';

type StepTrackProps = {
  current: number;
  length: number;
  back?: PATH;
};

export const StepTrack: FC<StepTrackProps> = ({ current, length, back }) => (
  <Stack direction="row" gap="md" center justify="space-between">
    <Stack center gap="sm">
      {back && (
        <>
          <BackButton href={back} />
          <Divider type="vertical" />
        </>
      )}

      <Text
        size="xxs"
        color="secondary"
        data-testid="stepTrackText"
        weight={500}
      >
        Step {current} of {length}
      </Text>
    </Stack>
    <StepIndicator length={length} current={current - 1} backSolid halfGap />
  </Stack>
);
