import { UseFormReturn } from 'react-hook-form';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';
import { useEffect } from 'react';
import { useNodeOperatorFirstKeysBond } from 'shared/hooks';

export const useCalculateBondAmount = (
  { watch, setValue }: UseFormReturn<SubmitKeysFormInputType>,
  { curveId }: SubmitKeysFormNetworkData,
) => {
  const [token, depositData] = watch(['token', 'depositData']);

  const { data, loading } = useNodeOperatorFirstKeysBond({
    keysCount: depositData.length,
    token,
    curveId,
  });

  useEffect(() => {
    setValue('bondAmount', loading ? undefined : data);
  }, [data, loading, setValue]);
};
