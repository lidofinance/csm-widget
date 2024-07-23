import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useNodeOperatorNextKeysBond } from 'shared/hooks';
import { AddKeysFormInputType, AddKeysFormNetworkData } from './types';

export const useFormBondAmount = (
  { watch, setValue }: UseFormReturn<AddKeysFormInputType>,
  { nodeOperatorId }: AddKeysFormNetworkData,
) => {
  const [token, depositData] = watch(['token', 'depositData']);

  const { data: bondAmount } = useNodeOperatorNextKeysBond({
    nodeOperatorId,
    keysCount: depositData.length,
    token,
  });

  useEffect(() => {
    setValue('bondAmount', bondAmount, { shouldValidate: true });
  }, [bondAmount, setValue]);
};
