import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SubmitKeysFormInputType } from './types';
import { useAccount } from 'shared/hooks';
import { getCsmWc } from 'consts/csm-wc';
import { parseDepositData } from 'shared/keys';

export const useCalculateDepositData = ({
  watch,
  setValue,
  setError,
  clearErrors,
  getFieldState,
}: UseFormReturn<SubmitKeysFormInputType>) => {
  const { chainId } = useAccount();
  const wc = getCsmWc(chainId);
  const rawDepositData = watch('rawDepositData');
  const { isTouched } = getFieldState('rawDepositData');

  useEffect(() => {
    if (!rawDepositData && !isTouched) return;
    const { error, depositData } = parseDepositData(
      rawDepositData || '',
      chainId,
      wc,
    );
    if (depositData && !error) {
      setValue('depositData', depositData);
      clearErrors('depositData');
    } else {
      setValue('depositData', []);
      setError('depositData', {
        type: 'VALIDATE',
        message: error?.message,
      });
    }
  }, [chainId, clearErrors, isTouched, rawDepositData, setError, setValue, wc]);
};
