import { FC, useCallback } from 'react';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import {
  splitsEqual,
  SplitsFormInputType,
  useSplitsFormData,
} from '../context';
import { Button } from '@lidofinance/lido-ui';
import { useFormContext, useWatch } from 'react-hook-form';

export const SubmitButton: FC = () => {
  const { currentFeeSplits } = useSplitsFormData(true);
  const { reset } = useFormContext();

  const feeSplits = useWatch<SplitsFormInputType, 'feeSplits'>({
    name: 'feeSplits',
  });

  const isUnchanged = splitsEqual(feeSplits ?? [], currentFeeSplits);

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <>
      <SubmitButtonHookForm disabled={isUnchanged}>
        {currentFeeSplits.length > 0 ? 'Apply changes' : 'Save splits'}
      </SubmitButtonHookForm>

      <Button variant="outlined" fullwidth onClick={handleCancel}>
        Cancel
      </Button>
    </>
  );
};
