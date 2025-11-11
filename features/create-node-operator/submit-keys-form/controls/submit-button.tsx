import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useSubmitKeysFormData } from '../context';

export const SubmitButton = () => {
  const { isPaused } = useSubmitKeysFormData();

  if (isPaused) {
    return <PausedButton type="Module" />;
  }

  return <SubmitButtonHookForm>Create Node Operator</SubmitButtonHookForm>;
};
