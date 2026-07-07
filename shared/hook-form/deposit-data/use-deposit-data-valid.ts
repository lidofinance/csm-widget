import { useFormState, useWatch } from 'react-hook-form';
import { DepositDataInputType } from './use-parse-deposit-data';

// Deposit data is ready to confirm only when at least one key is parsed and
// neither the raw input nor the parsed keys carry a validation error.
export const useDepositDataValid = (): boolean => {
  const [depositData] = useWatch<DepositDataInputType, ['depositData']>({
    name: ['depositData'],
  });

  const { errors } = useFormState<DepositDataInputType>({
    name: ['depositData', 'rawDepositData'],
  });

  const hasError = !!(errors.rawDepositData || errors.depositData);

  return depositData.length > 0 && !hasError;
};
