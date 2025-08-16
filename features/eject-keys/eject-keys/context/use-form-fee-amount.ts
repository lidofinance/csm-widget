import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EjectKeysFormInputType, EjectKeysFormNetworkData } from './types';

export const useFormFeeAmount = (
  { watch, setValue }: UseFormReturn<EjectKeysFormInputType>,
  { ejectKeyFee }: EjectKeysFormNetworkData,
) => {
  const selection = watch('selection');

  const feeAmount =
    ejectKeyFee !== undefined && selection?.length
      ? ejectKeyFee * BigInt(selection.length)
      : undefined;

  useEffect(() => {
    setValue('feeAmount', feeAmount, { shouldValidate: true });
  }, [feeAmount, setValue]);
};
