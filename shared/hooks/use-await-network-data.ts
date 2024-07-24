import { useMemo } from 'react';
import { useAwaiter } from 'shared/hooks';
import { awaitWithTimeout } from 'utils';

// time that validation function waits for context data to resolve
// should be enough to load token balances/tvl/max&min amounts and other contract data
export const VALIDATION_CONTEXT_TIMEOUT = 4000;

type BaseNetworkData = {
  loading: Record<string, boolean>;
};

export const useAwaitNetworkData = <T extends BaseNetworkData>(
  { loading, ...data }: T,
  timeout = VALIDATION_CONTEXT_TIMEOUT,
) => {
  const loadedData = useMemo(() => {
    const allLoaded = Object.values(loading).every((v) => !v);
    return allLoaded ? data : undefined;
  }, [loading, data]);

  const promise = useAwaiter(loadedData).awaiter;

  return useMemo(() => awaitWithTimeout(promise, timeout), [promise, timeout]);
};
