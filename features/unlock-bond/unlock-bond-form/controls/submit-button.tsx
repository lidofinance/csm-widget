import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useUnlockBondFormData } from '../context';

export const SubmitButton = () => {
  const { isExpired } = useUnlockBondFormData();

  return (
    <SubmitButtonHookForm>
      {isExpired ? 'Unlock expired bond' : 'Compensate locked bond'}
    </SubmitButtonHookForm>
  );
};
