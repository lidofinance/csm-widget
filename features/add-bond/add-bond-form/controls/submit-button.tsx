import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useAddBondFormData } from '../context';

export const SubmitButton = () => {
  const { isPaused } = useAddBondFormData();
  if (isPaused) {
    return <PausedButton type="Accounting" />;
  }

  return (
    <SubmitButtonHookForm errorField="bondAmount">
      Add Bond
    </SubmitButtonHookForm>
  );
};
