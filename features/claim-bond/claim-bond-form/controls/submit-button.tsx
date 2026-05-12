import { PausedButton, SubmitButtonHookForm } from 'shared/hook-form/controls';
import { useClaimBondFormData } from '../context';
import { useClaimOptions } from '../hooks/use-claim-options';

export const SubmitButton = () => {
  const { isPaused } = useClaimBondFormData(true);
  const { submitLabel } = useClaimOptions();

  if (isPaused) {
    return <PausedButton type="Accounting" />;
  }

  return <SubmitButtonHookForm>{submitLabel}</SubmitButtonHookForm>;
};
