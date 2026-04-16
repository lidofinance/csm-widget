import { Text } from '@lidofinance/lido-ui';
import { type FC } from 'react';
import { useWatch } from 'react-hook-form';
import { Stack, StepIndicator } from 'shared/components';
import type { CuratedOperatorFormInputType } from '../context/types';

export const StepTrack: FC = () => {
  const currentStep = useWatch<CuratedOperatorFormInputType, 'step'>({
    name: 'step',
  });

  // TODO: enchance styles
  return (
    <Stack direction="row" gap="md" center justify="space-between">
      <Text size="xxs" color="secondary" data-testid="stepTrackText">
        Step {currentStep} of 4
      </Text>
      <StepIndicator length={4} current={currentStep - 1} />
    </Stack>
  );
};
