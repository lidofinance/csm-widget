import type { DepositData } from '@lidofinance/lido-csm-sdk';
import { useSmSDK, useTargetModule } from 'modules/web3';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import invariant from 'tiny-invariant';

export type DepositDataInputType = {
  rawDepositData: string | undefined;
  depositData: DepositData[];
  confirmKeysReady: boolean;
};

export const useParseDepositData = () => {
  const targetModule = useTargetModule();
  const sdk = useSmSDK(targetModule);

  const { watch, getFieldState, setValue, clearErrors, setError } =
    useFormContext<DepositDataInputType>();
  const rawDepositData = watch('rawDepositData');
  const { isTouched } = getFieldState('rawDepositData');

  useEffect(() => {
    if (!rawDepositData && !isTouched) return;
    invariant(sdk, 'deposit data needs a target module');
    const result = sdk.depositData.parseDepositData(rawDepositData || '');

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
  }, [clearErrors, isTouched, rawDepositData, setError, setValue, sdk]);
};
