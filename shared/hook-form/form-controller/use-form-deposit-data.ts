/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getCsmWc } from 'consts/csm-wc';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useAccount } from 'shared/hooks';
import { parseDepositData, validateDepositData } from 'shared/keys';
import invariant from 'tiny-invariant';
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
  const { chainId } = useAccount();
  const wc = getCsmWc(chainId);
  // @ts-expect-error
  const rawDepositData = watch('rawDepositData');
  // @ts-expect-error
  const { isTouched } = getFieldState('rawDepositData');

  // TODO: move errors to validation or validate on submit
  useEffect(() => {
    if (!rawDepositData && !isTouched) return;
    // @ts-expect-error
    const { error, depositData } = parseDepositData(rawDepositData || '');

    if (depositData && !error) {
      // @ts-expect-error
      setValue('depositData', depositData, { shouldValidate: true });

      invariant(chainId);
      invariant(wc);

      const error = validateDepositData(depositData, chainId, wc);

      if (error) {
        // @ts-expect-error
        setError('depositData', {
          type: 'VALIDATE',
          message: error?.message,
        });
      } else {
        // @ts-expect-error
        clearErrors('depositData');
      }

      // @ts-expect-error
      clearErrors('depositData');
    } else {
      // @ts-expect-error
      setValue('depositData', [], { shouldValidate: true });
      // @ts-expect-error
      setError('depositData', {
        type: 'VALIDATE',
        message: error?.message,
      });
    }
  }, [chainId, clearErrors, isTouched, rawDepositData, setError, setValue, wc]);
};
