import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useNodeOperatorLockAmount } from 'shared/hooks';
import { StealingCancelFormInputType } from './types';

export const useFormMaxAmount = ({
  watch,
  setValue,
  trigger,
}: UseFormReturn<StealingCancelFormInputType>) => {
  const nodeOperatorId = watch('nodeOperatorId');

  const { data: maxAmount } = useNodeOperatorLockAmount(nodeOperatorId);

  useEffect(() => {
    void trigger('maxAmount');
  }, [nodeOperatorId, trigger]);

  useEffect(() => {
    setValue('maxAmount', maxAmount, { shouldValidate: true });
  }, [maxAmount, setValue]);
};
