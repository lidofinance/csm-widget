import { Button, Stack } from '@lidofinance/lido-app-ui';
import { FC, useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { GasCostList, SubmitButton } from 'shared/form-page';
import { SplitsFormInputType, useSplitsFormData } from '../context';
import { getSplitsSubmitLabel, splitsEqual } from '../splits-state';

export const SplitsCtas: FC = () => {
  const { currentFeeSplits } = useSplitsFormData(true);
  const { reset } = useFormContext<SplitsFormInputType>();

  const feeSplits = useWatch<SplitsFormInputType, 'feeSplits'>({
    name: 'feeSplits',
  });

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <Stack gap={12}>
      <GasCostList />
      <SubmitButton disabled={splitsEqual(feeSplits ?? [], currentFeeSplits)}>
        {getSplitsSubmitLabel(currentFeeSplits.length > 0)}
      </SubmitButton>
      <Button fullWidth variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
    </Stack>
  );
};
