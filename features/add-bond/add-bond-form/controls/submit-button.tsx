import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useAddBondFlow } from '../context';

export const SubmitButton = () => {
  const flow = useAddBondFlow();

  if (flow.action === 'paused') {
    return <PausedButton type="Accounting" />;
  }

  return <SubmitButtonHookForm>Add Bond</SubmitButtonHookForm>;
};
