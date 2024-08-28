import { UseFormReturn } from 'react-hook-form';
import { AddBondFormInputType } from './types';
import { useEffect } from 'react';

export const useFormRevalidate = ({
  watch,
  trigger,
}: UseFormReturn<AddBondFormInputType>) => {
  const [token] = watch(['token']);

  useEffect(() => {
    void trigger('bondAmount');
  }, [token, trigger]);
};
