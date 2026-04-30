import { useMemo } from 'react';
import { useFormDataContext } from 'shared/hook-form/form-controller';
import { useAwaiter } from 'shared/hooks';

// time that validation function waits for context data to resolve
// should be enough to load token balances/tvl/max&min amounts and other contract data
export const VALIDATION_CONTEXT_TIMEOUT = 30000;

export const useAwaitFormData = <C extends object, T = C>(options?: {
  select?: (data: C) => T;
  timeout?: number;
}) => {
  const { data, isPending } = useFormDataContext<C>();
  const { select, timeout = VALIDATION_CONTEXT_TIMEOUT } = options ?? {};

  const value = useMemo(
    () =>
      isPending ? undefined : select ? select(data) : (data as unknown as T),
    [isPending, data, select],
  );

  return useAwaiter(value, timeout);
};
