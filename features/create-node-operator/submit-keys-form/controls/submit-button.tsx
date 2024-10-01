import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useSubmitKeysFormData } from '../context';

export const SubmitButton = () => {
  const { isPaused } = useSubmitKeysFormData();

  if (isPaused) {
    return <PausedButton type="Module" />;
  }

  return (
    <SubmitButtonHookForm errorField="rawDepositData">
      Create Node Operator
    </SubmitButtonHookForm>
  );
};
