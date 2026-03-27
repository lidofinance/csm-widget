import { FC, useCallback } from 'react';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useSplitsFormData } from '../context';
import { Button } from '@lidofinance/lido-ui';
import { useFormContext } from 'react-hook-form';

export const SubmitButton: FC = () => {
  const { currentFeeSplits } = useSplitsFormData(true);
  const { reset } = useFormContext();

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <>
      <SubmitButtonHookForm>
        {currentFeeSplits.length > 0 ? 'Apply changes' : 'Save splits'}
      </SubmitButtonHookForm>

      <Button variant="outlined" fullwidth onClick={handleCancel}>
        Cancel
      </Button>
    </>
  );
};
