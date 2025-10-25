import { useMemo } from 'react';
import { useFormDataContext } from 'shared/hook-form/form-controller';
import { useAwaiter } from 'shared/hooks';

// time that validation function waits for context data to resolve
// should be enough to load token balances/tvl/max&min amounts and other contract data
export const VALIDATION_CONTEXT_TIMEOUT = 30000;

export const useAwaitFormData = <T extends object>(
  timeout = VALIDATION_CONTEXT_TIMEOUT,
) => {
  const { data, isPending } = useFormDataContext<T>();

  const loadedData = useMemo(
    () => (isPending ? undefined : data),
    [isPending, data],
  );

  return useAwaiter(loadedData, timeout).awaiter;
};
