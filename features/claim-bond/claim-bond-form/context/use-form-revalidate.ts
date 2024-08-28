import { UseFormReturn } from 'react-hook-form';
import { ClaimBondFormInputType } from './types';
import { useEffect } from 'react';

export const useFormRevalidate = ({
  watch,
  trigger,
}: UseFormReturn<ClaimBondFormInputType>) => {
  const [token, claimRewards] = watch(['token', 'claimRewards']);

  useEffect(() => {
    void trigger('amount');
  }, [token, claimRewards, trigger]);
};
