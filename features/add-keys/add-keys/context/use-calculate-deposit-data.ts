import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SubmitKeysFormInputType } from './types';

export const useCalculateDepositData = ({
  watch,
  setValue,
  setError,
  clearErrors,
}: UseFormReturn<SubmitKeysFormInputType>) => {
  const rawDepositData = watch('rawDepositData');

  useEffect(() => {
    try {
      const parsedData = JSON.parse(rawDepositData || '[]');
      if (Array.isArray(parsedData)) {
        setValue('depositData', parsedData);
        clearErrors('depositData');
      } else {
        throw new Error('invalid json');
      }
      // TODO: validate parsed data
    } catch (e) {
      setValue('depositData', []);
      setError('depositData', {
        type: 'VALIDATE',
        message: 'invalid json',
      });
    }
  }, [clearErrors, rawDepositData, setError, setValue]);
};
