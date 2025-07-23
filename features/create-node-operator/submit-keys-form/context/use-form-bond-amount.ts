import { useBondByKeysCount } from 'modules/web3';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';

export const useFormBondAmount = (
  { watch, setValue, trigger }: UseFormReturn<SubmitKeysFormInputType>,
  { curveId }: SubmitKeysFormNetworkData,
) => {
  const [token, depositData] = watch(['token', 'depositData']);

  const { data: bondAmount } = useBondByKeysCount({
    keysCount: depositData?.length ?? 0,
    token,
    curveId,
  });

  useEffect(() => {
    void trigger('bondAmount');
  }, [token, trigger]);

  useEffect(() => {
    setValue('bondAmount', bondAmount, { shouldValidate: true });
  }, [bondAmount, setValue]);
};
