import { useCallback, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
import { useAwaiter } from 'shared/hooks';
import { useFormDataContext } from './';

export const useFormDefaultValues = <
  F extends FieldValues = any,
  C extends object = any,
>(
  select: (data: C) => F,
) => {
  const { data, isPending } = useFormDataContext<C>();

  const defaultValue = useMemo(
    () => (isPending ? undefined : select(data)),
    [isPending, select, data],
  );

  const { awaiter } = useAwaiter(defaultValue);

  return useCallback(() => awaiter, [awaiter]);
};
