import { useOperatorBalance } from 'modules/web3';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { StealingCancelFormInputType } from './types';

export const useFormMaxAmount = ({
  watch,
  setValue,
  trigger,
}: UseFormReturn<StealingCancelFormInputType>) => {
  const nodeOperatorId = watch('nodeOperatorId');

  const { data: maxAmount } = useOperatorBalance(
    nodeOperatorId,
    (data) => data.locked,
  );

  useEffect(() => {
    void trigger('maxAmount');
  }, [nodeOperatorId, trigger]);

  useEffect(() => {
    setValue('maxAmount', maxAmount, { shouldValidate: true });
  }, [maxAmount, setValue]);
};
