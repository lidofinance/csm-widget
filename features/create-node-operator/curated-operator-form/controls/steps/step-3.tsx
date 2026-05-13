import { Button, Text } from '@lidofinance/lido-ui';
import { type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Stack } from 'shared/components';
import type { CuratedOperatorFormInputType } from '../../context/types';
import { useStepValidation } from '../../hooks/use-step-validation';
import { OperatorInfoInputs } from '../operator-info-inputs';

export const Step3: FC = () => {
  const currentStep = useWatch<CuratedOperatorFormInputType, 'step'>({
    name: 'step',
  });
  const { setValue } = useFormContext<CuratedOperatorFormInputType>();
  const canContinue = useStepValidation(3);

  if (currentStep !== 3) return null;

  return (
    <Stack direction="column" gap="xxl">
      <Text as="h3" size="lg" weight={700} data-testid="stepTitle">
        Set Node Operator name and description
      </Text>

      <OperatorInfoInputs />

      <Stack>
        <Button
          variant="outlined"
          fullwidth
          onClick={() => setValue('step', 2)}
        >
          Back
        </Button>
        <Button
          fullwidth
          disabled={!canContinue}
          onClick={() => setValue('step', 4)}
        >
          Continue
        </Button>
      </Stack>
    </Stack>
  );
};
