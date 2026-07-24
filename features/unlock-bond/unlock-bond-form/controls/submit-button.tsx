import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useUnlockBondFlow } from '../context';

export const SubmitButton = () => {
  const flow = useUnlockBondFlow();

  return (
    <SubmitButtonHookForm>
      {flow.action === 'unlock-expired'
        ? 'Unlock bond'
        : 'Compensate locked bond'}
    </SubmitButtonHookForm>
  );
};
