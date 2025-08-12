import { FC } from 'react';
import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useApplyFormController } from '../context';

export const SubmitButton: FC = () => {
  const { onSubmit } = useApplyFormController();

  return (
    <SubmitButtonHookForm onClick={onSubmit}>
      Submit application
    </SubmitButtonHookForm>
  );
};