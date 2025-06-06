import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AddKeysFormInputType, AddKeysFormNetworkData } from './types';
import { useBondNextKeysCount } from 'modules/web3';

export const useFormBondAmount = (
  { watch, setValue, trigger }: UseFormReturn<AddKeysFormInputType>,
  { nodeOperatorId }: AddKeysFormNetworkData,
) => {
  const [token, depositData] = watch(['token', 'depositData']);

  const { data: bondAmount } = useBondNextKeysCount({
    nodeOperatorId,
    keysCount: depositData?.length ?? 0,
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
