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
      const parsedData = JSON.parse(rawDepositData || '');
      if (!Array.isArray(parsedData)) {
        throw new Error('invalid json');
      }

      // TODO: validate parsed data
      setValue('depositData', parsedData);
      clearErrors('depositData');
    } catch (e) {
      setValue('depositData', []);
      setError('rawDepositData', {
        type: 'VALIDATE',
        message: 'invalid json',
      });
    }
  }, [clearErrors, rawDepositData, setError, setValue]);
};
