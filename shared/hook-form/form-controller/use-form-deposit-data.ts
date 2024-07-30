/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { parseDepositData } from 'shared/keys';
import { DepositData } from 'types';

export type DepositDataInputType = {
  rawDepositData: string | undefined;
  depositData: DepositData[];
};

// FIXME: types
export const useFormDepositData = <T extends DepositDataInputType>({
  watch,
  setValue,
  setError,
  clearErrors,
  getFieldState,
}: UseFormReturn<T>) => {
  // @ts-expect-error
  const rawDepositData = watch('rawDepositData');
  // @ts-expect-error
  const { isTouched } = getFieldState('rawDepositData');

  // FIXME: missed errors
  useEffect(() => {
    if (!rawDepositData && !isTouched) return;
    // @ts-expect-error
    const { error, depositData } = parseDepositData(rawDepositData || '');

    if (depositData && !error) {
      // @ts-expect-error
      setValue('depositData', depositData, { shouldValidate: true });
      // @ts-expect-error
      clearErrors('rawDepositData');
    } else {
      // @ts-expect-error
      setValue('depositData', [], { shouldValidate: true });
      // @ts-expect-error
      setError('rawDepositData', {
        type: 'VALIDATE',
        message: error?.message,
      });
    }
  }, [clearErrors, isTouched, rawDepositData, setError, setValue]);
};
