import { Button, Text } from '@lidofinance/lido-ui';
import { type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Stack } from 'shared/components';
import type { CuratedOperatorFormInputType } from '../../context/types';
import { VerificationSummary } from '../verification-summary';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';

export const Step4: FC = () => {
  const currentStep = useWatch<CuratedOperatorFormInputType, 'step'>({
    name: 'step',
  });
  const { setValue } = useFormContext<CuratedOperatorFormInputType>();

  if (currentStep !== 4) return null;

  return (
    <Stack direction="column" gap="xxl">
      <Text as="h3" size="lg" weight={700}>
        Confirm Node Operator creation
      </Text>

      <VerificationSummary />

      <Stack>
        <Button
          variant="outlined"
          fullwidth
          onClick={() => setValue('step', 3)}
        >
          Back
        </Button>
        <SubmitButtonHookForm>Create Node Operator</SubmitButtonHookForm>
      </Stack>
    </Stack>
  );
};
