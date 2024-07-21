import { UseFormReturn } from 'react-hook-form';
import { useNodeOperatorFirstKeysBond } from 'shared/hooks';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';
import { useEffect } from 'react';

export const useFormBondAmount = (
  { watch, setValue }: UseFormReturn<SubmitKeysFormInputType>,
  { curveId }: SubmitKeysFormNetworkData,
) => {
  const [token, depositData] = watch(['token', 'depositData']);

  const { data: bondAmount } = useNodeOperatorFirstKeysBond({
    keysCount: depositData.length,
    token,
    curveId,
  });

  useEffect(() => {
    setValue('bondAmount', bondAmount, { shouldValidate: true });
  }, [bondAmount, setValue]);
};
