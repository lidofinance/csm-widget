import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useNodeOperatorNextKeysBond } from 'shared/hooks';
import { AddKeysFormInputType, AddKeysFormNetworkData } from './types';

export const useFormBondAmount = (
  { watch, setValue, trigger }: UseFormReturn<AddKeysFormInputType>,
  { nodeOperatorId }: AddKeysFormNetworkData,
) => {
  const [token, depositData] = watch(['token', 'depositData']);

  const { data: bondAmount } = useNodeOperatorNextKeysBond({
    nodeOperatorId,
    keysCount: depositData.length,
    token,
  });

  // TODO: move to somethere
  useEffect(() => {
    void trigger('bondAmount');
  }, [token, trigger]);

  useEffect(() => {
    setValue('bondAmount', bondAmount, { shouldValidate: true });
  }, [bondAmount, setValue]);
};
