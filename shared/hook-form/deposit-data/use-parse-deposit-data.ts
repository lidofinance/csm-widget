import type { DepositData } from '@lidofinance/lido-csm-sdk';
import { useLidoSDK } from 'modules/web3';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export type DepositDataInputType = {
  rawDepositData: string | undefined;
  depositData: DepositData[];
  confirmKeysReady: boolean;
};

export const useParseDepositData = () => {
  const { csm } = useLidoSDK();
  const { watch, getFieldState, setValue, clearErrors, setError } =
    useFormContext<DepositDataInputType>();
  const rawDepositData = watch('rawDepositData');
  const { isTouched } = getFieldState('rawDepositData');

  useEffect(() => {
    if (!rawDepositData && !isTouched) return;
    const result = csm.depositData.parseDepositData(rawDepositData || '');

    if (result.success && result.data) {
      clearErrors('depositData');
      clearErrors('rawDepositData');
      setValue('depositData', result.data, { shouldValidate: true });
    } else {
      clearErrors('depositData');
      setValue('depositData', [], { shouldValidate: true });
      setError('rawDepositData', {
        type: 'VALIDATE',
        message: result.error || 'Failed to parse deposit data',
      });
    }
  }, [
    clearErrors,
    isTouched,
    rawDepositData,
    setError,
    setValue,
    csm.depositData,
  ]);
};
