import { FC, useCallback } from 'react';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useSplitsFormData } from '../context';
import { Button } from '@lidofinance/lido-ui';
import { useFormContext } from 'react-hook-form';

export const SubmitButton: FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { currentFeeSplits } = useSplitsFormData(true);
  const { reset } = useFormContext();

  const handleCancel = useCallback(() => {
    onCancel();
    reset();
  }, [onCancel, reset]);

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
