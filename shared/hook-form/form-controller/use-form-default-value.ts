import { useCallback } from 'react';
import { FieldValues } from 'react-hook-form';
import { useAwaitFormData } from './use-await-form-data';

export const useFormDefaultValues = <
  F extends FieldValues = any,
  C extends object = any,
>(
  select: (data: C) => F,
) => {
  const awaiter = useAwaitFormData<C, F>({ select, timeout: 0 });
  return useCallback(() => awaiter, [awaiter]);
};
