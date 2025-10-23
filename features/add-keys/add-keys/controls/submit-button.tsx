import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useAddKeysFormData } from '../context';

export const SubmitButton = () => {
  const { isPaused } = useAddKeysFormData();

  if (isPaused) {
    return <PausedButton type="Module" />;
  }

  return (
    <SubmitButtonHookForm errorField="rawDepositData">
      {'Submit keys'}
    </SubmitButtonHookForm>
  );
};
