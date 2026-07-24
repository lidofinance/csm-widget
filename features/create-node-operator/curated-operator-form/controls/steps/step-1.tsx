import { Button, Text } from '@lidofinance/lido-ui';
import { type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Stack } from 'shared/components';
import type { CuratedOperatorFormInputType } from '../../context/types';
import { useStepValidation } from '../../hooks/use-step-validation';
import { GateSelector } from '../gate-selector';

export const Step1: FC = () => {
  const currentStep = useWatch<CuratedOperatorFormInputType, 'step'>({
    name: 'step',
  });
  const { setValue } = useFormContext<CuratedOperatorFormInputType>();
  const canContinue = useStepValidation(1);

  if (currentStep !== 1) return null;

  return (
    <Stack direction="column" gap="xxl">
      <Stack direction="column" gap="sm">
        <Text as="h3" size="lg" weight={700} data-testid="stepTitle">
          Select Sub-Node Operator Type
        </Text>
        <Text size="xs" color="secondary" data-testid="stepDescription">
          Choose the type you want to create now. You can create additional
          Sub-Node Operators with other types later
        </Text>
      </Stack>

      <GateSelector />

      <Button
        fullwidth
        disabled={!canContinue}
        onClick={() => setValue('step', 2)}
      >
        Continue
      </Button>
    </Stack>
  );
};
