import { getCsmConstants } from 'consts/csm-constants';
import { useMemo } from 'react';
import { useAccount, useAwaiter } from 'shared/hooks';

// time that validation function waits for context data to resolve
// should be enough to load token balances/tvl/max&min amounts and other contract data
export const VALIDATION_CONTEXT_TIMEOUT = 4000;

type BaseNetworkData = {
  loading: Record<string, boolean>;
};
export type DataContext<T extends BaseNetworkData> = ReturnType<
  typeof useContextPromise<T>
>;

export const useContextPromise = <T extends BaseNetworkData>({
  loading,
  ...data
}: T) => {
  const { chainId } = useAccount();
  const wc = getCsmConstants(chainId).withdrawalCredentials;

  const validationContextAwaited = useMemo(() => {
    const allLoaded = Object.values(loading).every((v) => !v);
    return allLoaded ? { ...data, wc, chainId } : undefined;
  }, [loading, data, wc, chainId]);

  return useAwaiter(validationContextAwaited).awaiter;
};
