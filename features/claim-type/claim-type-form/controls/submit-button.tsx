import { SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useClaimTypeFormData } from '../context';

export const SubmitButton = () => {
  const { icsPaused } = useClaimTypeFormData();

  return (
    <SubmitButtonHookForm errorField="curveId" disabled={icsPaused}>
      Claim operator type
    </SubmitButtonHookForm>
  );
};
